// Declare variables for the physics engine and world
let engine;

// Declare variables for bodies - these will be entities in the physics simulation
let balls = [];
let ground, ceiling, leftWall, rightWall;

// Define the colors for ball bodies based on their "type" (index)
// e.g., type 0 balls will have a color of (255,0,0)
let ballColors = [
    { red: 255, green: 0, blue: 0 },
    { red: 0, green: 255, blue: 0 },
    { red: 0, green: 0, blue: 255 },
    { red: 255, green: 255, blue: 0 }
];
let ballSizes = [
    20,
    30,
    40,
    50
]

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


function handleCollisionStart(event) {
    
    // iterate over all of the pairs of bodies that have collided
    for (let pair of event.pairs) {
        // each pair has two properties - bodyA and bodyB
        // we can check to see if both bodies have a 'customInfo' property
        if (pair.bodyA.customInfo && pair.bodyB.customInfo) {
            // if so, they are both "ball" bodies

            // now check if they are the same type
            console.log(pair.bodyA.customInfo.type, "===?===", pair.bodyB.customInfo.type)
            if (pair.bodyA.customInfo.type == pair.bodyB.customInfo.type) {

                // determine the new type by adding 1 to the current type
                let newType = pair.bodyA.customInfo.type + 1;

                // determine the average position of both balls
                let newX = (pair.bodyA.position.x + pair.bodyB.position.x) / 2;
                let newY = (pair.bodyA.position.y + pair.bodyB.position.y) / 2;

                // this collision should result in both balls getting "merged" into a single ball of one type higher
                createBall(newType, newX, newY);

                // delete the two existing balls
                deleteBall(pair.bodyA);
                deleteBall(pair.bodyB);
            }

        }
    }

}

function deleteBall(b) {
    for (let i = 0; i < balls.length; i++) {
        if (balls[i] == b) {
            balls.splice(i, 1);
            Matter.Composite.remove(engine.world, b);
            return;
        }
    }
}

function createBall(type, x, y) {

    // type is the type of ball to create (0, 1, 2, 3 or 4)
    if (type >= 4 ) {
        return;
    }

    // create a new body for this ball
    let ball = Matter.Bodies.circle(x, y, ballSizes[type], {
        restitution: 0.7, // bounciness
        density: 0.1,
        friction: 0.2
    });

    // give this ball a customInfo property
    ball.customInfo = {
        type: type
    }

    console.log(ball.customInfo);

    // add the ball to our array
    balls.push( ball );

    // add the ball to the world
    Matter.Composite.add(engine.world, ball);

}

function mousePressed() {
    createBall(0, mouseX, mouseY);
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
        let ballType = balls[i].customInfo.type;
        fill( ballColors[ballType].red, ballColors[ballType].green, ballColors[ballType].blue );

        // draw the ball
        ellipse(0, 0, ballSizes[ballType]*2, ballSizes[ballType]*2);

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