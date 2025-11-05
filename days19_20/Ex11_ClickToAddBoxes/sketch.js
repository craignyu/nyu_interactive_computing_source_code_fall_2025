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
    engine.gravity.y = 0.2;

    // Add some ground so our boxes have something to land on
    ground = Matter.Bodies.rectangle(300, 290, 600, 20, { isStatic: true });

    // Add the ground to the world
    Matter.Composite.add(engine.world, ground);

    // set all rectangles to draw from their center point
    // Matter uses the center point to define the position of a body
    rectMode(CENTER);
}

function mousePressed() {
    // if the mouse is pressed we can create a new box here
    // create a box body
    let box = Matter.Bodies.rectangle(mouseX, mouseY, 20, 20);

    // add the box body to the world
    Matter.Composite.add(world, box);

    // add the box body to our array so we can draw it later
    boxes.push(box);
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
        rect(0, 0, 20, 20);

        pop();
    }


    // Draw the ground - we can be lazy here since it doesn't rotate
    fill(128);
    rect(ground.position.x, ground.position.y, 600, 20);



    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);
}