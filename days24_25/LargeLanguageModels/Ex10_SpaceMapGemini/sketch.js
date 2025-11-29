let geminiHelper;

const stars = [];
let hoveredStarInfo = null;

function preload() {
    // see if we already have an API stored in our localStorage
    let apiKey = localStorage.getItem("gemini_api_key");

    // if not, we should prompt the user for an API key and store it
    if (!apiKey) {
        apiKey = prompt("Enter your Gemini API key: ");
        localStorage.setItem("gemini_api_key", apiKey);
    }

    // Construct a new GeminiHelper object
    // This object accepts two arguments
    // - Your Google Gemini API key
    // - Your desired AI model. The default is 'gemini-2.5-flash'
    // Some other models you can try
    //  - gemini-2.5-pro
    //  - gemini-2.0-flash-lite
    // All of these models are rate limited, so you should log into https://aistudio.google.com/ to check your usage often
    geminiHelper = new GeminiHelper(apiKey);
}

function setup() {
    createCanvas(600, 400);
    background(0);

    generateGalaxy();
}

function draw() {
    background(0);
    hoveredStarInfo = null;

    for (let i = 0; i < stars.length; i++) {
        const info = stars[i].display();
        if (info) {
            hoveredStarInfo = info;
        }
    }

    if (hoveredStarInfo) {
        drawScannerSidebar();
    }
}


async function generateGalaxy() {
    console.log("Initializing Galaxy Generation...");

    // 1. Define the Schema for a List of Systems
    // We ask for an object containing an array "star_systems"
    const galaxySchema = {
        name: "galaxy_data",
        schema: {
            type: "object",
            properties: {
                star_systems: {
                    type: "array",
                    description: "A list of 15 unique star systems",
                    items: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string",
                                description: "Sci-fi name"
                            },
                            star_color: {
                                type: "string",
                                description: "Visual color (Blue, White, Yellow, Orange, Red)"
                            },
                            planet_count: {
                                type: "integer",
                                description: "Number of planets (0-12)"
                            },
                            has_life: {
                                type: "boolean",
                                description: "True if biological life exists"
                            },
                            dominant_race: {
                                type: "string",
                                description: "Name of species (or 'None' if lifeless)"
                            },
                            civilization_trait: {
                                type: "string",
                                description: "One word trait (e.g. 'Warlike', 'Peaceful', 'Traders', 'Hivemind', 'N/A')"
                            }
                        },
                        required: ["name", "star_color", "planet_count", "has_life", "dominant_race", "civilization_trait"]
                    }
                }
            },
            required: ["star_systems"]
        }
    };

    try {
        // 2. Call the LLM
        const rawResponse = await geminiHelper.singleChatCompletion({
            systemPrompt: `You are a sci-fi procedural generator. 
            Generate a JSON object containing exactly 15 unique star systems. 
            Vary the star colors and planetary conditions. 
            Some systems should be barren, others teeming with life. Ensure that you only generate 15 star systems.`,

            message: "Generate the sector data now.",

            jsonSchema: galaxySchema
        });

        console.log(rawResponse);

        // 3. Parse and Use
        const data = JSON.parse(rawResponse);

        // This is your array of 10 systems!
        const systems = data.star_systems;

        console.log("Galaxy Generated:", systems);

        // create Star objects based on this information
        for (let i = 0; i < systems.length; i++) {
            stars.push(new Star(random(25, 375), random(25, height - 25), systems[i]));
        }

        // Example: Log the first system's details
        if (systems.length > 0) {
            const s = systems[0];
            console.log(`System 1: ${s.name} (${s.star_color} Star) - Home of the ${s.civilization_trait} ${s.dominant_race}`);
        }

        return systems;

    } catch (error) {
        console.error("Galaxy Generation Failed:", error);
        return [];
    }
}


class Star {

    constructor(x, y, starSystemInfo) {
        this.x = x;
        this.y = y;
        this.starSystemInfo = starSystemInfo;

        let grey = random(150, 255);
        this.color = color(grey, grey, grey);
        this.size = random(5, 10);
    }

    display() {
        noStroke();

        let distanceFromMouse = dist(this.x, this.y, mouseX, mouseY);

        if (distanceFromMouse < this.size) {
            stroke(255, 255, 0);
            strokeWeight(3);
            noFill();
            ellipse(this.x, this.y, this.size * 2, this.size * 2);

            noStroke();
            fill(255);
            text(this.starSystemInfo.name, this.x + 25, this.y);

            fill(this.color);
            ellipse(this.x, this.y, this.size, this.size);

            return this.starSystemInfo;
        }

        fill(this.color);
        ellipse(this.x, this.y, this.size, this.size);

        return null;
    }

}


function drawScannerSidebar() {
    push();
    rectMode(CORNER);
    noStroke();
    fill(15, 20, 40);
    rect(450, 0, 150, 400);
    pop();

    push();
    fill(200);
    textSize(12);
    textLeading(18);
    textWrap(WORD);
    textAlign(LEFT, TOP);

    const boxX = 460;
    const boxY = 20;
    const boxW = 130;
    const boxH = 360;

    if (hoveredStarInfo) {
        const lines = [
            `Name: ${hoveredStarInfo.name}`,
            `Color: ${hoveredStarInfo.star_color}`,
            `Planets: ${hoveredStarInfo.planet_count}`,
            `Life: ${hoveredStarInfo.has_life ? 'Yes' : 'No'}`,
            `Dominant: ${hoveredStarInfo.dominant_race}`,
            `Trait: ${hoveredStarInfo.civilization_trait}`
        ].join('\n\n');

        text(lines, boxX, boxY, boxW, boxH);
    } else {
        text('Scanner idle.\n\nHover over a star to analyze its system.', boxX, boxY, boxW, boxH);
    }

    pop();
}