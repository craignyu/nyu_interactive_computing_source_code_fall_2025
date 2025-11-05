// Declare variables for the physics engine and world
let engine;

// Declare variables for bodies - these will be entities in the physics simulation
let boxes = [];
let ground, ceiling, leftWall, rightWall;

// Set up a variable for the MouseConstraint. This will create a spring-like
// connector between the mouse and any body that is clicked, allowing for dragging.
let mConstraint;

// Set up a category that can be used to tag bodies as grabble
// we use powers of 2 here (e.g, 0x0001, 0x0002, 0x0004, 0x0008, 0x0016, etc.)
// there are 32 possible categories that we can set up in this way
const grabbableCategory = 0x0001;
const nonGrabbableCategory = 0x0002;

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
    // these will be grabbable
    for (let i = 0; i < 10; i++) {
        // define the width and height for our box
        let w = random(20, 40);
        let h = random(20, 40);

        // create our box body
        let box = Matter.Bodies.rectangle(random(100, 500), 50, w, h, {
            restitution: 0.7, // Add bounciness
            friction: 0.1,
            collisionFilter: {
                // associate this box with the 'grabbable' category
                category: grabbableCategory
            }
        });

        // we can attach a "custom" object to the body so that we can access with width/height/color later
        box.customInfo = {
            type: 'rect',
            width: w,
            height: h,
            color: color(random(255), random(255), random(255))
        }

        // add the box to our array
        boxes.push(box);
    }

    // Create a few dynamic circles with bounciness
    // these will not be grabbable
    for (let i = 0; i < 10; i++) {
        // define the width and height for our box
        let radius = random(10, 20);

        // create our box body
        let box = Matter.Bodies.circle(random(100, 500), 50, radius, {
            restitution: 0.7, // Add bounciness
            friction: 0.1,
            collisionFilter: {
                // associate this box with the 'grabbable' category
                category: nonGrabbableCategory
            }
        });

        // we can attach a "custom" object to the body so that we can access radius/color later
        box.customInfo = {
            type: 'ellipse',
            radius: radius,
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
        },
        collisionFilter: {
            // this tells the mouse to only grab bodies categorized in the grabbableCategory
            mask: grabbableCategory
        },
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

        if (boxes[i].customInfo.type == 'rect') {
            rect(0, 0, boxes[i].customInfo.width, boxes[i].customInfo.height);
        }
        else if (boxes[i].customInfo.type == 'ellipse') {
            ellipse(0, 0, boxes[i].customInfo.radius * 2, boxes[i].customInfo.radius * 2);
        }
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