// set up a classifier variable to load our model
let classifier;

// variables for displaying the results on the canvas
let label = "";
let confidence = "";

// variable for an off screen graphics buffer;
let buffer;

function preload() {
    // load in our desired model (in this case, an image classifier for doodles)
    classifier = ml5.imageClassifier("DoodleNet");
}

function setup() {
    createCanvas(400, 300);

    // create a buffer of the same size for the canvas
    // this is where the user will be drawing
    buffer = createGraphics(400, 300);
    buffer.fill(255);

    // ask our classsifer to classify the image of what's currently on the buffer
    // gotResult is a callback function that will be invoked when the classifier is finished
    // note that "classifyStart" will *continually* try and classify the canvas,
    // whereas "classify" will only classify once
    classifier.classifyStart(buffer, gotResult);

    // set up drawing logic
    buffer.strokeWeight(20);
    clearBuffer();
}

function draw() {
    // simple drawing tool
    if (mouseIsPressed) {
        buffer.line(mouseX, mouseY, pmouseX, pmouseY);
    }

    // draw the buffer
    image(buffer, 0, 0);

    // draw our classification prediction
    text(label + " " + round(confidence*100, 2) + "% confident", 20, 20);
}

// this function runs when the user clicks the "Clear Buffer" button in HTML
function clearBuffer() {
    buffer.background(255);
}

// this function runs when the classifier finishes analyzing the drawing
function gotResult(results) {
    label = results[0].label;
    confidence = results[0].confidence;
}
