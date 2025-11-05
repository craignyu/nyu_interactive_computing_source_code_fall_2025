// Declare variables for the physics engine and world
let engine;

// Declare variables for bodies - these will be entities in the physics simulation
let ball;
let ground, leftWall, rightWall, ceiling;

// Declare DOM references for UI elements (sliders)
let velocity_y_slider, velocity_x_slider;

// Set up the starting position for our ball
const STARTING_BALL_X = 50;
const STARTING_BALL_Y = 260;

// setup function - used for commands that need to run only once
function setup() {
    createCanvas(600, 300);

    noStroke();
    rectMode(CENTER);

    // Create a Matter.js physics engine
    // This sets up the physics simulation environment
    engine = Matter.Engine.create();

    // Turn on gravity for this demo
    engine.gravity.y = 1;

    ball = Matter.Bodies.circle(STARTING_BALL_X, STARTING_BALL_Y, 20, { 
        density: 0.1,
        frictionAir: 0.0
    });
    Matter.Composite.add(engine.world, ball);

    // Next let's create some boundaries so the box can't go off the canvas
    ground    = Matter.Bodies.rectangle(width/2, 290, width, 20, { isStatic: true });
    ceiling   = Matter.Bodies.rectangle(width/2, 10, width, 20, { isStatic: true });
    leftWall  = Matter.Bodies.rectangle(10, height/2, 20, height, { isStatic: true });
    rightWall = Matter.Bodies.rectangle(590, height/2, 20, height, { isStatic: true });
    Matter.Composite.add(engine.world, ground);
    Matter.Composite.add(engine.world, ceiling);
    Matter.Composite.add(engine.world, leftWall);
    Matter.Composite.add(engine.world, rightWall);

    // get DOM references for our UI elements (sliders)
    velocity_x_slider = document.getElementById('velocity_x_slider');
    velocity_y_slider = document.getElementById('velocity_y_slider');

    // wire up the sliders so that we can call a custom function every time the user changes the slider
    velocity_x_slider.oninput = setVelocityX;
    velocity_y_slider.oninput = setVelocityY;
}

function mousePressed() {

}

// draw function - used for commands that need to be repeated
function draw() {
    background(0);

    // Draw the box
    fill(255);

    // we will use push and pop to isolate transformations (translate and rotate)
    push();

    // move the origin to the box position and rotate it according to its angle
    translate(ball.position.x, ball.position.y);
    rotate(ball.angle);

    // draw the box centered at the origin
    ellipse(0, 0, 40, 40);
    stroke(0);
    line(0,0,0,20);
    
    pop();


    // Draw the canvas boundaries - we can be lazy here since it doesn't rotate
    fill(128);
    rect(ground.position.x, ground.position.y, width, 20);
    rect(ceiling.position.x, ceiling.position.y, width, 20);
    rect(leftWall.position.x, leftWall.position.y, 20, height);
    rect(rightWall.position.x, rightWall.position.y, 20, height);


    fill(255);
    text("X Velocity: " + velocity_x_slider.value, 30, 40);
    text("Y Velocity: " + velocity_y_slider.value, 30, 60);

    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);
}

function setVelocityX() {
    velocityX = int(velocity_x_slider.value);
}

function setVelocityY() {
    velocityY = int(velocity_y_slider.value);
}

// this function resets the object back to its starting point
// and negates any accumulated velocity
function reset() {
    // reset the ball's position
    Matter.Body.setPosition(ball, { x: STARTING_BALL_X, y: STARTING_BALL_Y });

    // reset the ball's linear velocity
    Matter.Body.setVelocity(ball, { x: 0, y: 0 });

    // this resets the angular velocity (spin speed) of the ball
    Matter.Body.setAngularVelocity(ball, 0);

    // this resets the ball back to its initial rotation
    Matter.Body.setAngle(ball, 0);

    // reset the sliders
    velocity_x_slider.value = 0;
    velocity_y_slider.value = 0;
}

function tossBall() {
    Matter.Body.setVelocity(ball, {x: int(velocity_x_slider.value), y: int(velocity_y_slider.value)});
}