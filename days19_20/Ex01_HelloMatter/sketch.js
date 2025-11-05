// Declare variables for the physics engine and world
let engine;

// Declare variables for bodies - these will be entities in the physics simulation
let box, ball, ground;

// setup function - used for commands that need to run only once
function setup() {
    createCanvas(600, 300);

    // Create a Matter.js physics engine
    // This sets up the physics simulation environment
    engine = Matter.Engine.create();

    // Set gravity in our engine to pull objects downward
    engine.gravity.y = 0.2;

    // Create a world within the engine to hold all physics bodies
    world = Matter.Composite.create();

    // Add the world to the engine
    Matter.Composite.add(engine.world, world);

    // Let's add a box "body" to the world to see something happening
    // Here we create a rectangle body (a box) at position (200, 50) with width and height of 40
    // Note that 300,50 is the center point of the box
    box = Matter.Bodies.rectangle(200, 50, 40, 40);

    // next we have to add the body to the world so the physics engine can model its movement
    Matter.Composite.add(engine.world, box);

    // Next, let's add a circle body at position (400, 50) with a radius of 20
    ball = Matter.Bodies.circle(400, 50, 20);

    // add the ball to the physics engine
    Matter.Composite.add(engine.world, ball);

    // Finally, let's add some ground so the box and ball have something to land on
    // Here we are passing in an object with the property isStatic set to true. This makes the ground immovable.
    ground = Matter.Bodies.rectangle(300, 290, 600, 20, { isStatic: true });

    // Finally we add both the box and ground to the world
    Matter.Composite.add(engine.world, ground);

    // Matter stores the center point of the body, so we have to use rectMode(CENTER) when drawing
    rectMode(CENTER);
    noStroke();
}

// draw function - used for commands that need to be repeated
function draw() {
    background(0);

    // Matter doesn't directly draw to the canvas, so we need to manually draw our bodies
    // The body variables contain all of the information about their position, rotation, etc.

    // Draw the box
    fill(255,0,0);
    rect(box.position.x, box.position.y, 40, 40);

    // draw the ball
    fill(0,255,0);
    ellipse(ball.position.x, ball.position.y, 40, 40);

    // Draw the ground
    fill(128);
    rect(ground.position.x, ground.position.y, 600, 20);

    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);
}