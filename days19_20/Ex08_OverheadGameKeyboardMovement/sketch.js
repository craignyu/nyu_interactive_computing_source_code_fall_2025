// Declare variables for the physics engine and world
let engine;

// Declare variables for bodies - these will be entities in the physics simulation
let car;
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
    engine.gravity.y = 0;

    // Create our car body
    car = Matter.Bodies.rectangle(300, 150, 20, 20, { 
        density: 0.1,
        frictionAir: 0.0
    });
    Matter.Composite.add(engine.world, car);

    // Next let's create some boundaries so the box can't go off the canvas
    ground    = Matter.Bodies.rectangle(width/2, 290, width, 20, { isStatic: true });
    ceiling   = Matter.Bodies.rectangle(width/2, 10, width, 20, { isStatic: true });
    leftWall  = Matter.Bodies.rectangle(10, height/2, 20, height, { isStatic: true });
    rightWall = Matter.Bodies.rectangle(590, height/2, 20, height, { isStatic: true });
    Matter.Composite.add(engine.world, ground);
    Matter.Composite.add(engine.world, ceiling);
    Matter.Composite.add(engine.world, leftWall);
    Matter.Composite.add(engine.world, rightWall);
}

// draw function - used for commands that need to be repeated
function draw() {
    background(0);

    // Draw the box
    fill(255);

    // we will use push and pop to isolate transformations (translate and rotate)
    push();

    // move the origin to the car position and rotate it according to its angle
    translate(car.position.x, car.position.y);
    rotate(car.angle);

    // draw the box centered at the origin
    rect(0, 0, 20, 20);

    // restore transformation matrix
    pop();


    // handle key presses
    // A key - go left
    if (keyIsDown(65)) {
        Matter.Body.applyForce(car, car.position, { x: -0.05, y: 0 });
    }
    // D key - go right
    if (keyIsDown(68)) {
        Matter.Body.applyForce(car, car.position, { x: 0.05, y: 0 });
    }
    if (keyIsDown(87)) {
        Matter.Body.applyForce(car, car.position, { x: 0, y: -0.05 });
    }
    // D key - go right
    if (keyIsDown(83)) {
        Matter.Body.applyForce(car, car.position, { x: 0, y: 0.05 });
    }

    // speed limit
    let velocityLimitX = constrain( car.velocity.x, -5, 5 );
    let velocityLimitY = constrain( car.velocity.y, -5, 5 );
    Matter.Body.setVelocity(car, {x: velocityLimitX, y: velocityLimitY} );
    

    // Draw the canvas boundaries - we can be lazy here since it doesn't rotate
    fill(128);
    rect(ground.position.x, ground.position.y, width, 20);
    rect(ceiling.position.x, ceiling.position.y, width, 20);
    rect(leftWall.position.x, leftWall.position.y, 20, height);
    rect(rightWall.position.x, rightWall.position.y, 20, height);


    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);
}