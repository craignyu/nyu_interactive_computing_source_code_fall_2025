// Declare variables for the physics engine and world
let engine;

// Declare variables for bodies - these will be entities in the physics simulation
let bodies = [];
let ground;

// setup function - used for commands that need to run only once
function setup() {
    createCanvas(600, 300);

    // Create a Matter.js physics engine
    // This sets up the physics simulation environment
    engine = Matter.Engine.create();

    // Set gravity in our engine to pull objects downward
    engine.gravity.y = 0.2;

    // Create a world within the engine to hold all physics bodies
    world = Matter.Composite.create();

    // Add the world to the engine
    Matter.Composite.add(engine.world, world);

    // Add some ground so our boxes have something to land on
    ground = Matter.Bodies.rectangle(300, 290, 600, 20, { isStatic: true });

    // Add the ground to the world
    Matter.Composite.add(world, ground);

    // set all rectangles to draw from their center point
    // Matter uses the center point to define the position of a body
    rectMode(CENTER);
}

function mousePressed() {
    // if the mouse is pressed we can create a new body here, using random to switch between the body types

    // rectangular bodies
    if (random() > 0.5) {
        // create the body and add to our array
        let newBox = new Box(mouseX, mouseY);
        bodies.push(newBox);
    }

    // create a circular body
    else {
        let newBox = new Circle(mouseX, mouseY);
        bodies.push(newBox);
    }

}

// draw function - used for commands that need to be repeated
function draw() {
    background(0);

    // Draw all bodies
    for (let i = 0; i < bodies.length; i++) {
        bodies[i].display();
    }

    // Draw the ground - we can be lazy here since it doesn't rotate
    fill(128);
    rect(ground.position.x, ground.position.y, 600, 20);

    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);
}



class Box {

    constructor(x, y) {

        // pick a random size for this box
        this.size = int(random(10, 30));

        // pick a random color for this box
        this.red = random(255);
        this.green = random(255);
        this.blue = random(255);

        // set up a speed variable to change our color over time
        this.colorChangeSpeed = 1;

        // create a body
        this.body = Matter.Bodies.rectangle(x, y, this.size, this.size, {
            density: 0.1,
            restitution: 0.1
        });

        // add the body to our world
        Matter.Composite.add(world, this.body);

    }

    display() {
        rectMode(CENTER);
        fill(this.red, this.green, this.blue);

        push();
        translate(this.body.position.x, this.body.position.y);
        rotate(this.body.angle);
        rect(0, 0, this.size, this.size);
        pop();

        // cycle the color for this object
        this.red += this.colorChangeSpeed;
        this.green += this.colorChangeSpeed;
        this.blue += this.colorChangeSpeed;
        if (this.red > 255 || this.red < 0) {
            this.colorChangeSpeed *= -1;
        }
        if (this.green > 255 || this.green < 0) {
            this.colorChangeSpeed *= -1;
        }
        if (this.blue > 255 || this.blue < 0) {
            this.colorChangeSpeed *= -1;
        }
    }

}


class Circle {

    constructor(x, y) {

        // pick a random size for this box
        this.size = int(random(5, 20));

        // pick a random color for this box
        this.red = random(255);
        this.green = random(255);
        this.blue = random(255);

        // create a body
        this.body = Matter.Bodies.circle(x, y, this.size, {
            density: 0.1,
            restitution: 1.0
        });

        // add the body to our world
        Matter.Composite.add(world, this.body);

    }

    display() {
        rectMode(CENTER);
        fill(this.red, this.green, this.blue);

        push();
        translate(this.body.position.x, this.body.position.y);
        rotate(this.body.angle);
        ellipse(0, 0, this.size*2, this.size*2);

        // draw an indicator to show rotation
        stroke(255,0,0);
        strokeWeight(3);
        line(0, 0, 0, this.size);

        pop();

    }


}