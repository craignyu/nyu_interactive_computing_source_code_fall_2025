// our Gemini Helper object, which will serve as our connection to Google Gemini
let geminiHelper;

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
}

// note that we need to mark this function as 'async' in order to allow JS to pause this function
// until Web LLM successfully returns a result
async function mousePressed() {

    textAlign(CENTER);
    fill(255);

    background(0);
    text("Contacting Google Gemini ...", width / 2, height / 2);

    // ask the LLM helper to run a single chat completion
    // this is a "one shot" request that does not have persistence or memory
    // we are using 'await' here to pause the function until this completes successfully
    const modelResponse = await geminiHelper.singleChatCompletion({
        systemPrompt: `You are an eccentric comedian known for puns and clean humor.`,
        message: 'Tell a short knock knock joke (4 lines max).'
    });

    console.log(modelResponse);

    // display the model's response on the canvas
    background(0);

    // style and wrap long responses into a centered text box
    noStroke();
    fill(255);
    textSize(16);
    textLeading(22);

    // use left/top alignment when drawing into a box
    textAlign(LEFT, TOP);

    // compute the box in which text can exist (it will wrap around)
    const padding = 20;
    const maxBoxWidth = 520;
    const boxWidth = Math.min(maxBoxWidth, width - padding * 2);
    const boxHeight = Math.min(300, height - padding * 2);
    const boxX = Math.round((width - boxWidth) / 2);
    const boxY = Math.round((height - boxHeight) / 2);

    // this variant of text() wraps text inside the provided rectangle
    text(modelResponse, boxX, boxY, boxWidth, boxHeight);
}