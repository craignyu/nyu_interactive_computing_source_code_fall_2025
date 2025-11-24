// our LLM Helper object, which will serve as our connection to Web LLM
let llmHelper;

function preload() {
    // Construct a new WebLLMHelper object
    // Note that this will use a default large language model
    // - "Llama-3.2-3B-Instruct-q4f32_1-MLC"
    // Model list: https://github.com/mlc-ai/web-llm/blob/main/src/config.ts#L293
    // Some other models you can try
    //  - Llama-3.2-1B-Instruct-q4f32_1-MLC (one step down from the default model, faster, less capable)
    //  - Llama-3.2-3B-Instruct-q4f32_1-MLC (current default model)
    //  - Qwen2.5-1.5B-Instruct-q4f32_1-MLC
    //  - Phi-3.5-mini-instruct-q4f32_1-MLC
    // You can pass a model name in as a string to the WebLLMHelper constructor
    // (e.g., new WebLLMHelper("Llama-3.2-1B-Instruct-q4f32_1-MLC"))
    // Note that the first time you use a model your browser will need to download it locally
    // This can take a *very* long time, especially if the model has a lot of parameters
    // Once the model is downloaded it will be stored in your browser's indexed database storage, so you won't have to re-download it in the future
    llmHelper = new WebLLMHelper();
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
    text("Contacting Web LLM ...", width / 2, height / 2);

    // ask the LLM helper to run a single chat completion
    // this is a "one shot" request that does not have persistence or memory
    // we are using 'await' here to pause the function until this completes successfully
    const modelResponse = await llmHelper.singleChatCompletion({
        systemPrompt: `You are an eccentric comedian known for obscure and witty humor. You hate clichés. You avoid common jokes like 'Interrupting Cow' or 'Orange you glad' and prefer to invent new puns or use underappreciated classics.`,
        message: 'Tell a knock knock joke.'
    });

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