// our LLM Helper object, which will serve as our connection to Web LLM
let llmHelper;

function preload() {
    // construct a new WebLLMHelper object
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
    text("Contacting Web LLM ...", width/2, height/2);

    // ask the LLM helper to run a single chat completion
    // this is a "one shot" request that does not have persistence or memory
    // we are using 'await' here to pause the function until this completes successfully
    const modelResponse = await llmHelper.singleChatCompletion({
        systemPrompt: `You are an eccentric comedian known for obscure and witty humor. You hate clichés. You avoid common jokes like 'Interrupting Cow' or 'Orange you glad' and prefer to invent new puns or use underappreciated classics.`,
        message: 'Tell a knock knock joke.',

        // "temperature" sets how creative the model should be. lower numbers are very literal, higher numbers are creative
        // 0.7 is the default, range is 0.0 to 2.0
        temperature: 0.8, 

        // "top_p" controls the diversity and randomness of the generated text by selecting tokens from the smallest possible 
        // set whose cumulative probability exceeds the specified threshold p
        // default is 1.0, which means use 100% of the available tokens
        top_p: 1.0,

        // "max_tokens" controls the maximum size of the response. a token is roughly 3/4 of a word.
        // default is unlimited
        max_tokens: 100        
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