// our LLM Helper object, which will serve as our connection to Web LLM
let llmHelper;

// this is a string that we will use to hold the current text that is 
// being streamed to us by Web LLM
let currentText = '';

function preload() {
    // construct a new WebLLMHelper object
    llmHelper = new WebLLMHelper();
}

function setup() {
    createCanvas(600, 400);
    background(0);
}

function draw() {
    background(0);

    // use left/top alignment when drawing into a box
    textAlign(LEFT, TOP);
    fill(255);

    // compute the box in which text can exist (it will wrap around)
    const padding = 20;
    const maxBoxWidth = 520;
    const boxWidth = Math.min(maxBoxWidth, width - padding * 2);
    const boxHeight = Math.min(300, height - padding * 2);
    const boxX = Math.round((width - boxWidth) / 2);
    const boxY = Math.round((height - boxHeight) / 2);

    // this variant of text() wraps text inside the provided rectangle
    text(currentText, boxX, boxY, boxWidth, boxHeight);

}

// note that we need to mark this function as 'async' in order to allow JS to pause this function
// until Web LLM successfully returns a result
async function mousePressed() {

    // reset currentText
    currentText = '';

    // ask the LLM helper to run a single chat completion
    // this is a "one shot" request that does not have persistence or memory
    // we are using 'await' here to pause the function until this completes successfully
    const modelResponse = await llmHelper.singleChatCompletion({
        systemPrompt: `You are an eccentric comedian known for obscure and witty humor. You hate clichés. You avoid common jokes like 'Interrupting Cow' or 'Orange you glad' and prefer to invent new puns or use underappreciated classics.`,
        message: 'Tell a knock knock joke.',

        onStream: (chunk, fullText) => {
            console.log("New token:", chunk);
            currentText = fullText; // Update global variable for draw()
        }
    });
}