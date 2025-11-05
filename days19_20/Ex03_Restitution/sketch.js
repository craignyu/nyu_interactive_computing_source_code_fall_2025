// Declare variables for the physics engine and world
let engine;

// Declare variables for bodies - these will be entities in the physics simulation
let ball1, ball2, ball3, ground;

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
    ball1 = Matter.Bodies.circle(150, 50, 20, { restitution: 0.0 });
    ball2 = Matter.Bodies.circle(300, 50, 20, { restitution: 0.5 });
    ball3 = Matter.Bodies.circle(450, 50, 20, { restitution: 1.0 });
    Matter.Composite.add(engine.world, ball1);
    Matter.Composite.add(engine.world, ball2);
    Matter.Composite.add(engine.world, ball3);

    // Next let's add some ground so the box has something to land on
    // Here we are passing in an object with the property isStatic set to true. This makes the ground immovable.
    ground = Matter.Bodies.rectangle(300, 290, 600, 20, { isStatic: true });
    Matter.Composite.add(engine.world, ground);
}

// draw function - used for commands that need to be repeated
function draw() {
    background(0);
    rectMode(CENTER);

    // Draw the balls

    // Ball 1
    push();
    fill(255, 0, 0);
    rectMode(CENTER);
    translate(ball1.position.x, ball1.position.y);
    rotate(ball1.angle);
    ellipse(0, 0, 40, 40);
    pop();

    // Ball 2
    push();
    fill(0, 255, 0);
    rectMode(CENTER);
    translate(ball2.position.x, ball2.position.y);
    rotate(ball2.angle);
    ellipse(0, 0, 40, 40);
    pop();

    // Ball 3
    push();
    fill(0, 0, 255);
    rectMode(CENTER);
    translate(ball3.position.x, ball3.position.y);
    rotate(ball3.angle);
    ellipse(0, 0, 40, 40);
    pop();

    // Draw the ground - we can be lazy here since it doesn't rotate
    fill(128);
    rect(ground.position.x, ground.position.y, 600, 20);


    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);
}

function reset() {
    Matter.Body.setPosition(ball1, {x: 150, y:50});
    Matter.Body.setPosition(ball2, {x: 300, y:50});
    Matter.Body.setPosition(ball3, {x: 450, y:50});
}