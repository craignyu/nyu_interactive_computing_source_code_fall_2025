// Declare variables for the physics engine and world
let engine;

// Declare variables for bodies - these will be entities in the physics simulation
let boxes = [];
let ground, ceiling, leftWall, rightWall;

// Set up a variable for the MouseConstraint. This will create a spring-like
// connector between the mouse and any body that is clicked, allowing for dragging.
let mConstraint;

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

    // Create a few dynamic boxes with bounciness
    for (let i = 0; i < 20; i++) {
        // define the width and height for our box
        let w = random(20, 40);
        let h = random(20, 40);

        // create our box body
        let box = Matter.Bodies.rectangle(random(100, 500), 50, w, h, {
            restitution: 0.7, // Add bounciness
            friction: 0.1
        });

        // we can attach a "custom" object to the body so that we can access with width/height/color later
        box.customInfo = {
            width: w,
            height: h,
            color: color(random(255), random(255), random(255))
        }

        // add the box to our array
        boxes.push(box);
    }

    // Add the whole array of boxes to the world
    Matter.Composite.add(engine.world, boxes);

    // Next let's create some boundaries so the box can't go off the canvas
    ground = Matter.Bodies.rectangle(width / 2, 290, width, 20, { isStatic: true });
    ceiling = Matter.Bodies.rectangle(width / 2, 10, width, 20, { isStatic: true });
    leftWall = Matter.Bodies.rectangle(10, height / 2, 20, height, { isStatic: true });
    rightWall = Matter.Bodies.rectangle(590, height / 2, 20, height, { isStatic: true });
    
    // Add all boundaries to the world at once using array syntax
    Matter.Composite.add(engine.world, [ground, ceiling, leftWall, rightWall]);


    // --- Setup Mouse Dragging ---

    // 1. Create a Matter.Mouse tracker
    //    We need to give it the p5.js canvas element (canvas.elt)
    let canvasMouse = Matter.Mouse.create(canvas.elt);

    // 2. Sync the mouse's pixelRatio with the p5.js canvas
    //    We hard-code this to 1 to match our pixelDensity(1) call above.
    canvasMouse.pixelRatio = 1;

    // 3. Create the MouseConstraint (the "spring" connector)
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

    // 4. Add the mouse constraint to the main engine's world
    Matter.Composite.add(engine.world, mConstraint);


    // set all rectangles to draw from their center point
    // Matter uses the center point to define the position of a body
    rectMode(CENTER);
}

// draw function - used for commands that need to be repeated
function draw() {
    background(0);
    noStroke();

    // Draw all bodies
    fill(255);
    for (let i = 0; i < boxes.length; i++) {
        push();
        translate(boxes[i].position.x, boxes[i].position.y);
        rotate(boxes[i].angle);
        fill(boxes[i].customInfo.color);
        rect(0, 0, boxes[i].customInfo.width, boxes[i].customInfo.height);
        pop();
    }

    // Draw the canvas boundaries
    fill(128);
    rect(ground.position.x, ground.position.y, width, 20);
    rect(ceiling.position.x, ceiling.position.y, width, 20);
    rect(leftWall.position.x, leftWall.position.y, 20, height);
    rect(rightWall.position.x, rightWall.position.y, 20, height);

    // This draws the green connector line while dragging
    // (debug purposes only to show how the mouse constraint is working)
    if (mConstraint.body) {

        // Get the mouse position
        let mousePos = mConstraint.mouse.position;

        // Get the body and the *local attachment point*
        let body = mConstraint.body;
        let attachmentPoint = mConstraint.constraint.pointB;

        // (OPTIONAL) --- VELOCITY CLAMPING ---
        // This prevents the user from "tossing" the body too hard
        // and causing it to "tunnel" through the walls.
        const maxSpeed = 20; // Set a maximum speed
        
        if (body.velocity.x > maxSpeed) {
            Matter.Body.setVelocity(body, { x: maxSpeed, y: body.velocity.y });
        }
        if (body.velocity.x < -maxSpeed) {
            Matter.Body.setVelocity(body, { x: -maxSpeed, y: body.velocity.y });
        }
        if (body.velocity.y > maxSpeed) {
            Matter.Body.setVelocity(body, { x: body.velocity.x, y: maxSpeed });
        }
        if (body.velocity.y < -maxSpeed) {
            Matter.Body.setVelocity(body, { x: body.velocity.x, y: -maxSpeed });
        }
        // --- END VELOCITY CLAMPING ---


        // Calculate the world-space position of the attachment point
        let rotatedPoint = Matter.Vector.rotate(attachmentPoint, body.angle);
        let worldPoint = Matter.Vector.add(body.position, rotatedPoint);

        // Draw the connector line
        push();
        stroke(0, 255, 0); // Make the line bright green
        strokeWeight(2);
        line(mousePos.x, mousePos.y, worldPoint.x, worldPoint.y);
        pop();

    }

    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);
}