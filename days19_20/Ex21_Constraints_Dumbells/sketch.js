// Declare variables for the physics engine and world
let engine;

// Set up a variable for the MouseConstraint. This will create a spring-like
// connector between the mouse and any body that is clicked, allowing for dragging.
let mConstraint;

// These variables will be used to create our "dumbbells"
// Each dumbbell consists of two balls and one constraint
let ballA1, ballB1, constraint1;
let ballA2, ballB2, constraint2;

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

    // --- Create Dumbbell 1 (Rigid) ---
    const ballOptions = {
        density: 0.1,
        restitution: 0.3,
        frictionAir: 0.0
    };

    ballA1 = Matter.Bodies.circle(150, 100, 15, ballOptions);
    ballB1 = Matter.Bodies.circle(250, 100, 15, ballOptions);

    // Create a constraint to link ballA1 and ballB1
    constraint1 = Matter.Constraint.create({
        bodyA: ballA1,
        bodyB: ballB1,
        length: 100,
        stiffness: 1.0 // 1.0 makes this a rigid "rod"
    });

    // Add all parts of the dumbbell to the world
    Matter.Composite.add(engine.world, [ballA1, ballB1, constraint1]);


    // --- Create Dumbbell 2 (Stretchy) ---
    ballA2 = Matter.Bodies.circle(400, 100, 15, ballOptions);
    ballB2 = Matter.Bodies.circle(500, 100, 15, ballOptions);

    // Create a constraint to link ballA2 and ballB2
    constraint2 = Matter.Constraint.create({
        bodyA: ballA2,
        bodyB: ballB2,
        length: 100,
        stiffness: 0.01, // 0.01 makes this a "bungee cord"
        damping: 0.1 // Add some damping to control the "boing"
    });

    // Add all parts of the dumbbell to the world
    Matter.Composite.add(engine.world, [ballA2, ballB2, constraint2]);


    // --- Setup Mouse Dragging ---
    let canvasMouse = Matter.Mouse.create(canvas.elt);
    canvasMouse.pixelRatio = 1;
    let options = {
        mouse: canvasMouse,
        constraint: {
            stiffness: 0.2, // A stable stiffness for dragging
            render: {
                visible: false // We'll draw our own connector using p5
            }
        }
    };
    mConstraint = Matter.MouseConstraint.create(engine, options);
    Matter.Composite.add(engine.world, mConstraint);

    // Add some ground so the box and ball have something to land on
    // Here we are passing in an object with the property isStatic set to true. This makes the ground immovable.
    ground = Matter.Bodies.rectangle(300, 290, 600, 20, { isStatic: true });
    Matter.Composite.add(engine.world, ground);

    // set all rectangles to draw from their center point
    // Matter uses the center point to define the position of a body
    rectMode(CENTER);
}

// Helper function to draw an ellipse for a body
function drawBall(body, color) {
    noStroke();
    fill(color);
    push();
    translate(body.position.x, body.position.y);
    rotate(body.angle);
    ellipse(0, 0, 30, 30); // 15 radius * 2
    pop();
}

// Helper function to draw a constraint (line)
function drawConstraint(constraint) {
    stroke(255);
    strokeWeight(2);
    // Get the world-space positions of the attachment points
    let posA = constraint.bodyA.position;
    let posB = constraint.bodyB.position;
    line(posA.x, posA.y, posB.x, posB.y);
}


// draw function - used for commands that need to be repeated
function draw() {
    background(0);

    // --- Draw Dumbbell 1 (Red) ---
    drawConstraint(constraint1);
    drawBall(ballA1, color(255, 0, 0));
    drawBall(ballB1, color(255, 0, 0));

    // --- Draw Dumbbell 2 (Blue) ---
    drawConstraint(constraint2);
    drawBall(ballA2, color(0, 0, 255));
    drawBall(ballB2, color(0, 0, 255));

    // Draw the ground
    fill(128);
    rect(ground.position.x, ground.position.y, 600, 20);

    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);
}
