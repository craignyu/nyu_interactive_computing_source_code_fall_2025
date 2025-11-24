let llmHelper;

function preload() {
    // construct a new WebLLMHelper object
    llmHelper = new WebLLMHelper();
}

function setup() {
    createCanvas(600, 400);
    background(0);

    fill(255);
    textAlign(CENTER);
    text("Click to generate a color palette", width / 2, height / 2);
}

async function mousePressed() {

    background(0);
    fill(255);
    textAlign(CENTER);
    text("Generating, please wait ...", width / 2, height / 2);

    // inspiration array to vary the output
    const inspiration = random(["Cyberpunk City", "Morning Fog", "Desert Sunset", "Electric Ocean"]);

    // here we are asking the LLM to respond to a message using a structured JSON output format
    const modelResponse = await llmHelper.singleChatCompletion({
        systemPrompt: `You are a digital color theorist. 
    Generate a color palette. 
    
    STRICT HEX CODE RULES:
    - Format: "#" followed by exactly 6 Hexadecimal characters (0-9, A-F).
    - Example: "#FF5733" is valid. "#FF573300" is INVALID.
    - Do NOT include alpha/transparency values.`,

        message: "Generate a sophisticated mood with a primary, secondary, and accent color. Your inspiration is ${inspiration}",

        temperature: 0.6,

        jsonSchema: {
            name: "mood_schema",
            schema: {
                type: "object",
                properties: {
                    mood: {
                        type: "string",
                        description: "A creative name for the mood (e.g., 'Neon Nostalgia')"
                    },
                    primary_hex: {
                        type: "string",
                        description: "Dominant color (e.g., #2A2A2A)"
                    },
                    secondary_hex: {
                        type: "string",
                        description: "Supporting color (e.g., #505050)"
                    },
                    accent_hex: {
                        type: "string",
                        description: "High contrast pop color (e.g., #FF0055)"
                    },
                    reasoning: {
                        type: "string",
                        description: "Why these colors work together"
                    }
                },
                required: ["mood", "primary_hex", "secondary_hex", "accent_hex", "reasoning"]
            }
        }
    });

    // try and turn this into a JSON object
    console.log(modelResponse);

    let moodInfo;
    try {
        moodInfo = JSON.parse(modelResponse);
    }
    catch (e) {
        console.log("JSON cannot be parsed");

        background(0);
        fill(255);
        textAlign(CENTER);
        text("Error, JSON cannot be parsed. Please try again.", width / 2, height / 2);

        return;
    }

    // draw the primary hex as the background color
    if (moodInfo.primary_hex) {
        background(moodInfo.primary_hex);
    }

    // draw the secondary hex as a rectangle
    if (moodInfo.secondary_hex) {
        fill(moodInfo.secondary_hex);
        noStroke();
        rect(0, height - 100, width - 200, 100);
    }

    // draw the accent hex as a rectangle
    if (moodInfo.accent_hex) {
        fill(moodInfo.accent_hex);
        noStroke();
        rect(width - 200, height - 100, 200, 100);
    }

    // draw the mood
    if (moodInfo.mood) {
        textAlign(CENTER, CENTER);
        textSize(30);
        fill(0);
        text(moodInfo.mood, width / 2, height / 2 - 100);
    }

    // draw the artist's reasoning
    if (moodInfo.reasoning) {
        // readable text sizing/spacing
        textSize(12);
        textLeading(16);
        textWrap(WORD);

        // compute a centered rectangle and draw using LEFT/TOP so wrapping behaves predictably
        const pad = 50;
        const boxW = width - pad * 2;
        const boxH = height - pad * 2;
        const boxX = Math.round((width - boxW) / 2);
        const boxY = Math.round((height - boxH) / 2);

        // use LEFT/TOP for boxed text to avoid baseline clipping and to allow wrapping
        textAlign(CENTER, CENTER);
        fill(0);
        noStroke();
        text(moodInfo.reasoning, boxX, boxY, boxW, boxH);
    }

}