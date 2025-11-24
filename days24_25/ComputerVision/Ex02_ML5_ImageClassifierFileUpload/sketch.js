// set up a classifier variable to load our model
let classifier;

// variables for displaying the results on the canvas
let label = "";
let confidence = "";

// variable for an off screen graphics buffer;
let buffer;

function preload() {
    // load in our desired model (in this case, an image classifier)
    classifier = ml5.imageClassifier("MobileNet");
}

function setup() {
    createCanvas(400, 300);

    // create a buffer of the same size for the canvas
    // this is where the user will be drawing
    buffer = createGraphics(400, 300);
    buffer.fill(255);
}

function draw() {
    // draw the buffer
    image(buffer, 0, 0);

    // draw our classification prediction
    fill(255);
    noStroke();
    rect(0,0,width,30);
    fill(0);
    text(label + " " + round(confidence*100, 2) + "% confident", 20, 20);
}

function uploadImage(input) {
    // grab the file from HTML
    const file = (input && input.files && input.files[0]) || null;

    // if the user didn't select anything, bail out here
    if (!file) return;

    // make sure the file is actually an image and not another file type
    if (!file.type.startsWith('image/')) {
        console.warn('Not an image file');
        return;
    }

    // construct the file URL (path) to the temporary image
    const url = URL.createObjectURL(file);

    // load in the image
    // note that we have to use a callback funtion here since we aren't doing this in preload
    // this callback will fire once the image has fully loaded
    loadImage(
                url,
                function (img){
                    // draw uploaded image into the buffer
                    buffer.clear();
                    buffer.image(img, 0, 0, buffer.width, buffer.height);

                    // classify once immediately; classifyStart (if active) will continue classifying
                    classifier.classify(buffer, gotResult);

                    // free the object URL
                    URL.revokeObjectURL(url);
                },
                function (error) {
                    console.log("Error loading image", error);

                    // free the object URL
                    URL.revokeObjectURL(url);
                }
            );
}

// this function runs when the classifier finishes analyzing the drawing
function gotResult(results) {
    label = results[0].label;
    confidence = results[0].confidence;
}
