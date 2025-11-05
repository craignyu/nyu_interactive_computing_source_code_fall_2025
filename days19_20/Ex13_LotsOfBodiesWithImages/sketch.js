// Declare variables for the physics engine and world
let engine;

// Declare variables for bodies - these will be entities in the physics simulation
let boxes = [];
let ground;

// An array to hold a bunch of images
let boxArtwork = [];

function preload() {
    boxArtwork.push( loadImage("../images/box1.png") );
    boxArtwork.push( loadImage("../images/box2.png") );
    boxArtwork.push( loadImage("../images/box3.png") );
    boxArtwork.push( loadImage("../images/box4.png") );
}

// setup function - used for commands that need to run only once
function setup() {
    createCanvas(600, 300);

    // Create a Matter.js physics engine
    // This sets up the physics simulation environment
    engine = Matter.Engine.create();

    // Set gravity in our engine to pull objects downward
    engine.gravity.y = 1;

    // Add some ground so our boxes have something to land on
    ground = Matter.Bodies.rectangle(300, 290, 600, 20, { isStatic: true });

    // Add the ground to the world
    Matter.Composite.add(engine.world, ground);

    // create lots of boxes and store them in an array
    for (let i = 0; i < 50; i++) {

        // create a size for this boxy
        let size = random(20, 30);

        // also pick an image for this body
        let myImage = random( boxArtwork );

        // create a new body using our width and height
        let box = Matter.Bodies.rectangle( random(20, width-20), random(-200, 0), size, size );

        // we can also attach a custom object to our body - this allows us to store extra data
        // that we may need later on (e.g., in draw)
        box.customInfo = {
            size: size,
            myImage: myImage
        }

        // add it to our array
        boxes.push( box );

        // add it to our world
        Matter.Composite.add(engine.world, box);
    }

    // set all rectangles to draw from their center point
    // Matter uses the center point to define the position of a body
    rectMode(CENTER);

    // also set all images to draw from their center point
    imageMode(CENTER);
}

// draw function - used for commands that need to be repeated
function draw() {
    background(0);

    // Draw the boxes
    for (let i = 0; i < boxes.length; i++) {

        fill(255);

        // we will use push and pop to isolate transformations (translate and rotate)
        push();

        // move the origin to the box position and rotate it according to its angle
        translate(boxes[i].position.x, boxes[i].position.y);
        rotate(boxes[i].angle);

        // draw the box centered at the origin
        // note that we can access the customInfo object to extract the size and image for this body        
        image(boxes[i].customInfo.myImage, 0, 0, boxes[i].customInfo.size, boxes[i].customInfo.size);

        pop();
    }

    // Draw the ground - we can be lazy here since it doesn't rotate
    fill(128);
    rect(ground.position.x, ground.position.y, 600, 20);

    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);
}