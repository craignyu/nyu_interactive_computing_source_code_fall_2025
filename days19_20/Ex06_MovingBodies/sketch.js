// Declare variables for the physics engine and world
let engine;

// Declare variables for bodies - these will be entities in the physics simulation
let ball1, ball2;
let ground, leftWall, rightWall, ceiling;

// setup function - used for commands that need to run only once
function setup() {
    createCanvas(600, 300);

    noStroke();
    rectMode(CENTER);

    // Create a Matter.js physics engine
    // This sets up the physics simulation environment
    engine = Matter.Engine.create();

    // Turn off gravity for this demo
    engine.gravity.y = 0.0;

    // --- Create Ball 1 (Red) ---
    ball1 = Matter.Bodies.circle(30, 100, 10, { 
        density: 0.1,
        frictionAir: 0.0
    });
    
    // --- Create Ball 2 (Blue) ---
    ball2 = Matter.Bodies.circle(30, 200, 10, { 
        density: 0.1,
        frictionAir: 0.0 
    });
    
    // Add both boxes to the world ---
    Matter.Composite.add(engine.world, [ball1, ball2]);

    // Next let's create some boundaries so the box can't go off the canvas
    ground    = Matter.Bodies.rectangle(width/2, 290, width, 20, { isStatic: true });
    ceiling   = Matter.Bodies.rectangle(width/2, 10, width, 20, { isStatic: true });
    leftWall  = Matter.Bodies.rectangle(10, height/2, 20, height, { isStatic: true });
    rightWall = Matter.Bodies.rectangle(590, height/2, 20, height, { isStatic: true });
    
    // Add all boundaries at once ---
    Matter.Composite.add(engine.world, [ground, ceiling, leftWall, rightWall]);
}

// draw function - used for commands that need to be repeated
function draw() {
    background(0);

    // --- Draw Box 1 (Red) ---
    fill(255, 0, 0);
    push();
    translate(ball1.position.x, ball1.position.y);
    rotate(ball1.angle);
    ellipse(0, 0, 20, 20);
    
    // Display velocity text for Box 1
    fill(255);
    let velocityX1 = ball1.velocity.x.toFixed(2);
    text("vX: " + velocityX1, 15, 0);
    pop();

    // --- Draw Box 2 (Blue) ---
    fill(0, 0, 255);
    push();
    translate(ball2.position.x, ball2.position.y);
    rotate(ball2.angle);
    ellipse(0, 0, 20, 20);
    
    // Display velocity text for Box 2
    fill(255);
    let velocityX2 = ball2.velocity.x.toFixed(2);
    text("vX: " + velocityX2, 15, 0);
    pop();


    // Draw the canvas boundaries
    fill(128);
    rect(ground.position.x, ground.position.y, width, 20);
    rect(ceiling.position.x, ceiling.position.y, width, 20);
    rect(leftWall.position.x, leftWall.position.y, 20, height);
    rect(rightWall.position.x, rightWall.position.y, 20, height);

    // Important! Update the physics engine on each frame
    Matter.Engine.update(engine);
}


// this function resets the objects back to their starting points
function reset() {
    // Reset Box 1
    Matter.Body.setPosition(ball1, { x: 30, y: 100 });
    Matter.Body.setVelocity(ball1, { x: 0, y: 0 });
    Matter.Body.setAngle(ball1, 0);
    Matter.Body.setAngularVelocity(ball1, 0);

    // Reset Box 2
    Matter.Body.setPosition(ball2, { x: 30, y: 200 });
    Matter.Body.setVelocity(ball2, { x: 0, y: 0 });
    Matter.Body.setAngle(ball2, 0);
    Matter.Body.setAngularVelocity(ball2, 0);
}

// this function sets the velocity on both bodies
function setVelocity() {
    Matter.Body.setVelocity(ball1, { x: 2, y: 0 });
    Matter.Body.setVelocity(ball2, { x: 2, y: 0 });
}

// this function applies a small amount of force to both bodies
function applyForce() {
    Matter.Body.applyForce(ball1, ball1.position, { x: 0.05, y: 0 });
    Matter.Body.applyForce(ball2, ball2.position, { x: 0.05, y: 0 });
}