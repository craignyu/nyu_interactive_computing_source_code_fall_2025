// Declare variables for the physics engine and world
let engine;

// Set up a variable for the MouseConstraint. This will create a spring-like
// connector between the mouse and any body that is clicked, allowing for dragging.
let mConstraint;

// These variables will be used to create our "chain"
let links = [];
let constraints = [];

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

    // --- Create a Chain ---
    const numLinks = 10;
    const linkSize = 10;
    const anchor = { x: 300, y: 50 }; // Fixed point to hang the chain from
    let previousLink = null;

    const linkOptions = {
        density: 0.1,
        restitution: 0.1,
        frictionAir: 0.0,
        friction: 0.3
    };

    for (let i = 0; i < numLinks; i++) {
        // Create a new link (a small rectangle)
        let link = Matter.Bodies.rectangle(300, 50 + (i * (linkSize + 5)), linkSize, linkSize, linkOptions);
        
        link.customInfo = {
            width: linkSize,
            height: linkSize,
            color: color(255, 0, 0)
        };
        links.push(link);

        // Define the constraint that will connect this link
        let constraintOptions = {
            length: linkSize + 5,
            stiffness: 0.8 // A stiff, rope-like connection
        };

        if (previousLink === null) {
            // This is the first link, attach it to the anchor
            constraintOptions.pointA = anchor;
            constraintOptions.bodyB = link;
        } else {
            // This is a subsequent link, attach it to the previous link
            constraintOptions.bodyA = previousLink;
            constraintOptions.bodyB = link;
            // Define the anchor points on each link (center)
            constraintOptions.pointA = { x: 0, y: linkSize / 2 };
            constraintOptions.pointB = { x: 0, y: -linkSize / 2 };
        }

        let constraint = Matter.Constraint.create(constraintOptions);
        constraints.push(constraint);

        // Keep track of this link for the next iteration
        previousLink = link;
    }

    // Add all links and all constraints to the world
    Matter.Composite.add(engine.world, links);
    Matter.Composite.add(engine.world, constraints);


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


    // set all rectangles to draw from their center point
    // Matter uses the center point to define the position of a body
    rectMode(CENTER);
}

// Helper function to draw a rectangular link
function drawLink(body) {
    noStroke();
    fill(body.customInfo.color);
    push();
    translate(body.position.x, body.position.y);
    rotate(body.angle);
    rect(0, 0, body.customInfo.width, body.customInfo.height);
    pop();
}

// Helper function to draw a constraint (line)
function drawConstraint(constraint) {
    stroke(255);
    strokeWeight(2);
    
    // Get the world-space positions of the attachment points
    // This handles both fixed points (pointA) and attached bodies (bodyA)
    let posA;
    if (constraint.bodyA) {
        posA = constraint.bodyA.position;
    }
    else {
        posA = constraint.pointA;
    }

    let posB;
    if (constraint.bodyB) {
        posB = constraint.bodyB.position;
    }
    else {
        posB = constraint.pointB;
    }
    
    line(posA.x, posA.y, posB.x, posB.y);
}


// draw function - used for commands that need to be repeated
function draw() {
    background(0);

    // --- Draw the Chain ---
    // Draw all the constraints
    for (let constraint of constraints) {
       drawConstraint(constraint);
    }
    
    // Draw all the links
    for (let link of links) {
        drawLink(link);
    }


    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);
}

