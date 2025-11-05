// Declare variables for the physics engine and world
let engine;

// Declare variables for bodies - these will be entities in the physics simulation
let box1, box2, box3, ground;

// setup function - used for commands that need to run only once
function setup() {
    createCanvas(600, 300);

    // Create a Matter.js physics engine
    // This sets up the physics simulation environment
    engine = Matter.Engine.create();

    // Set gravity in our engine to pull objects downward
    engine.gravity.y = 1;

    // Create 3 boxes. Each one will have a different "frictionAir" property, which simulates are resistance
    // A value of 0 means the body will never slow as it moves through space. The higher the value, the faster a body slows when moving through space.
    // Default is 0.1
    box1 = Matter.Bodies.rectangle(150, 50, 40, 40, { frictionAir: 0.1 });
    box2 = Matter.Bodies.rectangle(300, 50, 40, 40, { frictionAir: 0.2 });
    box3 = Matter.Bodies.rectangle(450, 50, 40, 40, { frictionAir: 0.5 });
    Matter.Composite.add(engine.world, box1);
    Matter.Composite.add(engine.world, box2);
    Matter.Composite.add(engine.world, box3);

    // Next let's add some ground so the box has something to land on
    // Here we are passing in an object with the property isStatic set to true. This makes the ground immovable.
    ground =Matter. Bodies.rectangle(300, 290, 600, 20, { isStatic: true });
    Matter.Composite.add(engine.world, ground);
}

// draw function - used for commands that need to be repeated
function draw() {
    background(0);
    rectMode(CENTER);

    // Draw the boxes

    // Box 1
    push();
    fill(255, 0, 0);
    rectMode(CENTER);
    translate(box1.position.x, box1.position.y);
    rotate(box1.angle);
    rect(0, 0, 40, 40);
    pop();

    // Box 2
    push();
    fill(0, 255, 0);
    rectMode(CENTER);
    translate(box2.position.x, box2.position.y);
    rotate(box2.angle);
    rect(0, 0, 40, 40);
    pop();

    // Box 3
    push();
    fill(0, 0, 255);
    rectMode(CENTER);
    translate(box3.position.x, box3.position.y);
    rotate(box3.angle);
    rect(0, 0, 40, 40);
    pop();

    // Draw the ground - we can be lazy here since it doesn't rotate
    fill(128);
    rect(ground.position.x, ground.position.y, 600, 20);


    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);
}

function reset() {
    Matter.Body.setPosition(box1, {x: 150, y:50});
    Matter.Body.setPosition(box2, {x: 300, y:50});
    Matter.Body.setPosition(box3, {x: 450, y:50});
}