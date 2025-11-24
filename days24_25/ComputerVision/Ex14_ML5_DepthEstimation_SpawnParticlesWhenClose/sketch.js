/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates running depth estimation real-time on your webcam.
 */

let depthEstimator;
let capture;
let depthMap;

// particle system
let particles = [];

// Video dimensions
let videoWidth = 640;
let videoHeight = 480;

function preload() {
    // Load and start the depth estimation model
    depthEstimator = ml5.depthEstimation();
}

function setup() {
    // Create a canvas the size of the webcam video
    createCanvas(videoWidth, videoHeight);

    // Create the video and hide it
    pixelDensity(1);
    capture = createCapture({
        video: {
            mandatory: {
                minWidth: 640,
                minHeight: 480,
                maxWidth: 640,
                maxHeight: 480
            }
        },
        audio: false
    });
    capture.hide();

    // Start continuous depth estimation on the webcam feed and make "gotResults" the callback function
    depthEstimator.estimateStart(capture, gotResults);
}

function draw() {
    background(0);

    // draw the video 
    image(capture, 0, 0, width, height);

    // if depth estimation results are available
    if (depthMap) {
        // set up a loop to iterate over the grid of pixels
        // we will determine how close these pixels are to the camera, and spawn particles
        // in regions that are very close
        for (let y = 0; y < height; y += 50) {
            for (let x = 0; x < width; x += 50) {
                //console.log(x, y, depthMap.getDepthAt(x, y));
                if (depthMap.getDepthAt(x, y) > 0.7) {
                    particles.push( new Particle(x, y));
                }
            }
        }
    }

    // draw and manage particle system
    for (let i = 0; i < particles.length; i++) {
        let result = particles[i].display();
        if (result) {
            particles.splice(i, 1);
            i--;
        }
    }
}

// Callback function that receives the depth estimation results
function gotResults(result) {
    // Store the latest result in the global variable depthMap
    depthMap = result;
}


class Particle {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.red = random(255);
        this.green = random(255);
        this.blue = random(255);
        this.alpha = 255;
        this.size = random(5,25);
        this.speed = {
            x: random(-3,3),
            y: random(-3,3)
        }
    }
    display() {
        this.x += this.speed.x;
        this.y += this.speed.y;
        noStroke();
        fill(this.red, this.green, this.blue, this.alpha);
        ellipse(this.x, this.y, this.size, this.size);
        this.alpha -= 5;
        if (this.alpha <= 0) {
            return true;
        }
        return false;
    }
}