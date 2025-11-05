// Declare variables for the physics engine and world
let engine;

// Declare variables for bodies - these will be entities in the physics simulation
let boxes = [];
let ground;

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
    for (let i = 0; i < 20; i++) {

        // create a width, height and color for this body
        let w = random(20, 30);
        let h = random(20, 30);
        let c = color( random(255), random(255), random(255));

        // create a new body using our width and height
        let box = Matter.Bodies.rectangle( random(20, width-20), 50, w, h );

        // we can also attach a custom object to our body - this allows us to store extra data
        // that we may need later on (e.g., in draw)
        box.customInfo = {
            width: w,
            height: h,
            color: c
        }

        // add it to our array
        boxes.push( box );

        // add it to our world
        Matter.Composite.add(engine.world, box);
    }

    // set all rectangles to draw from their center point
    // Matter uses the center point to define the position of a body
    rectMode(CENTER);
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
        // note that we can access the customInfo object to extract the width, height
        // and color for this body
        fill( boxes[i].customInfo.color );
        rect(0, 0, boxes[i].customInfo.width, boxes[i].customInfo.height);

        pop();
    }

    // Draw the ground - we can be lazy here since it doesn't rotate
    fill(128);
    rect(ground.position.x, ground.position.y, 600, 20);

    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);
}