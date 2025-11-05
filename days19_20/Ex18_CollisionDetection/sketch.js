// Declare variables for the physics engine and world
let engine;

// Declare variables for bodies - these will be entities in the physics simulation
let balls = [];
let ground, ceiling, leftWall, rightWall;

// setup function - used for commands that need to run only once
function setup() {
    // ensure that high-resolution displays are rendered at 1:1 ratio for this sketch
    // this ensures that the Mouse component can accurately identify collisions
    pixelDensity(1);

    // create our canvas, grabbing a reference for later use (see below) 
    const canvas = createCanvas(600, 300);

    // Create a Matter.js physics engine
    // This sets up the physics simulation environment
    engine = Matter.Engine.create();

    // Set gravity in our engine to pull objects downward
    engine.gravity.y = 1;

    // Create some boundaries so the bodies can't go off the canvas
    ground = Matter.Bodies.rectangle(width / 2, 290, width, 20, { isStatic: true });
    ceiling = Matter.Bodies.rectangle(width / 2, 10, width, 20, { isStatic: true });
    leftWall = Matter.Bodies.rectangle(10, height / 2, 20, height, { isStatic: true });
    rightWall = Matter.Bodies.rectangle(590, height / 2, 20, height, { isStatic: true });

    // Add all boundaries to the world at once using array syntax
    Matter.Composite.add(engine.world, [ground, ceiling, leftWall, rightWall]);

    // set up collision detection
    // this causes Matter to call the "handleCollisionStart" function anytime any two bodies collide with one another
    Matter.Events.on(engine, 'collisionStart', handleCollisionStart);

    // draw all rectangles from their center point
    rectMode(CENTER);
}

// whenever the mouse is pressed, create a ball here
function mousePressed() {

    // create a new body for this ball
    let ball = Matter.Bodies.circle(mouseX, mouseY, 20, {
        restitution: 0.7, // bounciness
        density: 0.1,
        friction: 0.2
    });

    // give this ball a customInfo property
    ball.customInfo = {
        color: color(random(255), random(255), random(255))
    }

    // add the ball to our array
    balls.push(ball);

    // add the ball to the world
    Matter.Composite.add(engine.world, ball);
}

// draw function - used for commands that need to be repeated
function draw() {
    background(0);
    noStroke();

    // Draw all balls
    for (let i = 0; i < balls.length; i++) {

        // start a new transformation
        push();

        // change origin position & rotate accordingly
        translate(balls[i].position.x, balls[i].position.y);
        rotate(balls[i].angle);

        // figure out what type of ball this is and use that color and size for the ball
        fill(balls[i].customInfo.color);

        // draw the ball
        ellipse(0, 0, 40, 40);

        // restore transofrmation matrix
        pop();

    }

    // Draw the canvas boundaries
    fill(128);
    rect(ground.position.x, ground.position.y, width, 20);
    rect(ceiling.position.x, ceiling.position.y, width, 20);
    rect(leftWall.position.x, leftWall.position.y, 20, height);
    rect(rightWall.position.x, rightWall.position.y, 20, height);

    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);
}


// this function runs every time two bodies collide
function handleCollisionStart(event) {

    // iterate over all of the pairs of bodies that have collided
    for (let pair of event.pairs) {

        // each pair has two properties - bodyA and bodyB
        // we can check to see if both bodies have a 'customInfo' property
        if (pair.bodyA.customInfo && pair.bodyB.customInfo) {
            // if so, they are both "ball" bodies
            // we can change their colors here by using a reference to bodyA and bodyB
            pair.bodyA.customInfo.color = color(random(255), random(255), random(255));
            pair.bodyB.customInfo.color = color(random(255), random(255), random(255));
        }
    }
}