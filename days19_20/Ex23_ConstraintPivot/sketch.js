// Declare variables for the physics engine and world
let engine;

// Bodies for our flipper and the top/bottom stops
let flipper, pinStopTop, pinStopBottom;

// Constraint for flipper pivot point
let pinConstraint;

// Constants
const FLIPPER_LENGTH = 100;
const FLIPPER_HEIGHT = 20;
const FLIPPER_X = 350;
const FLIPPER_Y = 150;

function setup() {
    createCanvas(600, 300);
    pixelDensity(1);

    engine = Matter.Engine.create();
    engine.gravity.y = 1;

    // Flipper centre 50 px to the right of the pivot
    flipper = Matter.Bodies.rectangle(FLIPPER_X, FLIPPER_Y, FLIPPER_LENGTH, FLIPPER_HEIGHT, {
        density: 0.1,
        restitution: 0.3,
        frictionAir: 0.0
    });
    Matter.Composite.add(engine.world, flipper);

    // Pin at (300,150) pulls on left edge (-50,0) of flipper
    pinConstraint = Matter.Constraint.create({
        pointA: { x: FLIPPER_X-50, y: FLIPPER_Y },
        bodyB: flipper,
        pointB: { x: -FLIPPER_LENGTH/2, y: 0 },
        length: 0,
        stiffness: 1.0,
        damping: 0.1
    });
    Matter.Composite.add(engine.world, pinConstraint);

    // Pin to stop upward motion
    pinStopTop = Matter.Bodies.circle(FLIPPER_X, FLIPPER_Y-20, 2, {
        isStatic: true
    });
    Matter.Composite.add(engine.world, pinStopTop);

    // Pin to stop backward motion
    pinStopBottom = Matter.Bodies.circle(FLIPPER_X - FLIPPER_LENGTH/2, FLIPPER_Y + FLIPPER_LENGTH/2, 2, {
        isStatic: true
    });
    Matter.Composite.add(engine.world, pinStopBottom);

    // draw all shapes from their center point
    rectMode(CENTER);
}

function draw() {
    background(0);

    // Draw flipper
    push();
    translate(flipper.position.x, flipper.position.y);
    rotate(flipper.angle);
    rect(0, 0, 100, 20);
    pop();

    fill(0,255,0);
    push();
    translate(pinStopTop.position.x, pinStopTop.position.y);
    rotate(pinStopTop.angle);
    ellipse(0,0,4,4);
    pop();

    push();
    translate(pinStopBottom.position.x, pinStopBottom.position.y);
    rotate(pinStopBottom.angle);
    ellipse(0,0,4,4);
    pop();

    if (mouseIsPressed) {
        Matter.Body.applyForce(flipper, flipper.position, { x: 0, y: -2 });
    }

    // Show angle for debugging
    fill(255);
    text(nf(flipper.angle, 0, 3), 20, 20);

    Matter.Engine.update(engine);
}