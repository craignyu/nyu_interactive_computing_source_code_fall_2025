// Declare variables for the physics engine and world
let engine;

// Set up a variable for the MouseConstraint. This will create a spring-like
// connector between the mouse and any body that is clicked, allowing for dragging.
let mConstraint;

// These variables will be used to create a composite entity, called a "Constraint"
// The ball will be a circular body that "hangs" on a string from a fixed point
let ball1, pendulum1;
let ball2, pendulum2;

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


    // Create a ball body (same as usual)
    ball1 = Matter.Bodies.circle(150, 200, 15, {
        density: .1,
        restitution: 0.3,
        frictionAir: 0.0
    })

    // Add the ball to the world
    Matter.Composite.add(engine.world, ball1);

    // Next we will create a "constraint" which will define a relationship between two entities
    //   pointA: a fixed point on the ceiling
    //   bodyB: the ball
    // Once we have set this up, we can define how the two entities will relate to one another by passing in a series of options
    pendulum1 = Matter.Constraint.create({
        pointA: { x: 150, y: 50 }, // fixed point on the ceiling
        bodyB: ball1,
        length: 150,
        stiffness: 0.01, // 1.0 is very stiff, 0.2 is like a soft spring
        damping: 0.01 // The amount of resistance applied to each body based on their velocities to limit the amount of oscillation. A value of 0.1 means the constraint will apply heavy damping, resulting in little to no oscillation. A value of 0 means the constraint will apply no damping.
    });

    // Add the constraint to the world
    Matter.Composite.add(engine.world, pendulum1);



    // Create a ball body (same as usual)
    ball2 = Matter.Bodies.circle(450, 200, 15, {
        density: .1,
        restitution: 0.3,
        frictionAir: 0.0
    })

    // Add the ball to the world
    Matter.Composite.add(engine.world, ball2);

    // Next we will create a "constraint" which will define a relationship between two entities
    //   pointA: a fixed point on the ceiling
    //   bodyB: the ball
    // Once we have set this up, we can define how the two entities will relate to one another by passing in a series of options
    pendulum2 = Matter.Constraint.create({
        pointA: { x: 450, y: 50 }, // fixed point on the ceiling
        bodyB: ball2,
        length: 150,
        stiffness: 0.01, // 1.0 is very stiff, 0.2 is like a soft spring
        damping: 0.2 // The amount of resistance applied to each body based on their velocities to limit the amount of oscillation. A value of 0.1 means the constraint will apply heavy damping, resulting in little to no oscillation. A value of 0 means the constraint will apply no damping.
    });

    // Add the constraint to the world
    Matter.Composite.add(engine.world, pendulum2);



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

// draw function - used for commands that need to be repeated
function draw() {
    background(0);
    noStroke();

    // draw the pendulum lines
    stroke(255);
    strokeWeight(5);
    line(pendulum1.pointA.x, pendulum1.pointA.y, ball1.position.x, ball1.position.y);

    // draw the ball
    noStroke();
    push();
    translate(ball1.position.x, ball1.position.y);
    rotate(ball1.angle);
    ellipse(0,0,40,40);
    pop();


    // draw the pendulum lines
    stroke(255);
    strokeWeight(5);
    line(pendulum2.pointA.x, pendulum2.pointA.y, ball2.position.x, ball2.position.y);

    // draw the ball
    noStroke();
    push();
    translate(ball2.position.x, ball2.position.y);
    rotate(ball2.angle);
    ellipse(0,0,40,40);
    pop();    

    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);
}