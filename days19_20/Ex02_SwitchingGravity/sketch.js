// Declare variables for the physics engine and world
let engine;

// Declare variables for bodies - these will be entities in the physics simulation
let box, ground, ceiling;

// setup function - used for commands that need to run only once
function setup() {
    createCanvas(600, 300);

    // Create a Matter.js physics engine
    // This sets up the physics simulation environment
    engine = Matter.Engine.create();

    // Initially we will start with no gravity in our world
    engine.gravity.y = 0;

    // Create a rectangular body to demonstrate how gravity works
    box = Matter.Bodies.rectangle(300, 150, 40, 40); 

    // Next let's add ground and a ceiling so the box has something to land on
    // We will set these as static since they are immovable
    ground = Matter.Bodies.rectangle(300, 290, 600, 20, { isStatic: true });
    ceiling = Matter.Bodies.rectangle(300, 10, 600, 20, { isStatic: true });

    // Finally we add all of the bodies to the world
    Matter.Composite.add(engine.world, box);
    Matter.Composite.add(engine.world, ground);
    Matter.Composite.add(engine.world, ceiling);
}

// this function will be called whenever the user changes the slider (see HTML document)
function changeGravity(sliderElement) {
    engine.gravity.y = float( sliderElement.value );
}

// draw function - used for commands that need to be repeated
function draw() {
    background(0);

    // Draw the box
    fill(255);
    rectMode(CENTER);
    rect(box.position.x, box.position.y, 40, 40);

    // Draw the ground and ceiling
    fill(128);
    rect(ground.position.x, ground.position.y, 600, 20);
    rect(ceiling.position.x, ceiling.position.y, 600, 20);

    // Display current gravity value
    fill(255);
    text("Gravity: " + engine.gravity.y, 20, 40);

    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);
}