// Declare variables for the physics engine and world
let engine;

// Declare variables for bodies - these will be entities in the physics simulation
let box, ground;

// setup function - used for commands that need to run only once
function setup() {
    createCanvas(600, 300);

    // Create a Matter.js physics engine
    // This sets up the physics simulation environment
    engine = Matter.Engine.create();

    // Set gravity in our engine to pull objects downward
    engine.gravity.y = 0.2;

    // We can assign a starting rotation to any body using the options object
    // Here we are setting the "angle" attribute to be radians(46), meaning this box will
    // have an initial rotation of 46 degrees
    box = Matter.Bodies.rectangle(300, 50, 40, 40, { angle: radians(46) });

    // Next let's add some ground so the box has something to land on
    // Here we are passing in an object with the property isStatic set to true. This makes the ground immovable.
    ground = Matter.Bodies.rectangle(300, 290, 600, 20, { isStatic: true });

    // Finally we add both the box and ground to the world
    Matter.Composite.add(engine.world, box);
    Matter.Composite.add(engine.world, ground);
}

// draw function - used for commands that need to be repeated
function draw() {
    background(0);

    // Draw the box
    fill(255);
    rectMode(CENTER);

    // we will use push and pop to isolate transformations (translate and rotate)
    push();

    // move the origin to the box position and rotate it according to its angle
    translate(box.position.x, box.position.y);
    rotate(box.angle);

    // draw the box centered at the origin
    rect(0, 0, 40, 40);

    pop();


    // Draw the ground - we can be lazy here since it doesn't rotate
    fill(128);
    rect(ground.position.x, ground.position.y, 600, 20);



    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);
}

function reset() {
    Matter.Body.setPosition(box, {x: 300, y:50});
    Matter.Body.setAngle(box, radians(46));
}