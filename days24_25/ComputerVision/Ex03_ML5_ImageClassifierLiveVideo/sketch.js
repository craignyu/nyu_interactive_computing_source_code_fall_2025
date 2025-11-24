// set up a classifier variable to load our model
let classifier;

// variables for displaying the results on the canvas
let label = "";
let confidence = "";

// variable for an off screen graphics buffer;
let buffer;

// variable to connect to the user's camera (live video stream)
let capture;

function preload() {
    // load in our desired model (in this case, an image classifier)
    classifier = ml5.imageClassifier("MobileNet");
}

function setup() {
    createCanvas(400, 300);

    // create our capture object, which will request access to the user's camera
    // this creates a new <video> element on the page
    pixelDensity(1);
    capture = createCapture({
        video: {
            mandatory: {
                minWidth: 400,
                minHeight: 300,
                maxWidth: 400,
                maxHeight: 300
            }
        },
        audio: false
    });

    // hide the video element - we will display it ourselves in our buffer
    capture.hide();

    // create a buffer of the same size for the canvas
    // this is where the user will be drawing
    buffer = createGraphics(400, 300);
    buffer.fill(255);

    // ask our classsifer to classify the image of what's currently on the buffer
    // gotResult is a callback function that will be invoked when the classifier is finished
    // note that "classifyStart" will *continually* try and classify the buffer,
    // whereas "classify" will only classify once
    classifier.classifyStart(buffer, gotResult);
}

function draw() {
    // draw the buffer
    buffer.image(capture, 0, 0, 400, 300);
    image(buffer, 0, 0);

    // draw our classification prediction
    fill(255);
    noStroke();
    rect(0,0,width,30);
    fill(0);
    text(label + " " + round(confidence*100, 2) + "% confident", 20, 20);
}

// this function runs when the classifier finishes analyzing the drawing
function gotResult(results) {
    label = results[0].label;
    confidence = results[0].confidence;
}
