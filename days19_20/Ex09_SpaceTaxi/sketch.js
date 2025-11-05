// inspired by the 1984 video game "Space Taxi"
// https://www.youtube.com/watch?v=cEcxgPvmQqU

// Declare variables for the physics engine and world
let engine;

// Declare variables for bodies - these will be entities in the physics simulation
let car;
let ground, leftWall, rightWall, ceiling;
let platform1;

// Coin (objective)
let coin = {
    x: 0,
    y: 0
}

// Particle system for thrust
let particles = [];

// Image assets
let artTaxiLeft, artTaxiRight, currentTaxi;

function preload() {
    artTaxiLeft = loadImage('../images/taxi_left.png');
    artTaxiRight = loadImage('../images/taxi_right.png');
    currentTaxi = artTaxiLeft;
}

// setup function - used for commands that need to run only once
function setup() {
    createCanvas(600, 300);

    noStroke();
    rectMode(CENTER);

    // Create a Matter.js physics engine
    // This sets up the physics simulation environment
    engine = Matter.Engine.create();

    // Turn off gravity for this demo
    engine.gravity.y = 0.1;

    // Create our car body
    car = Matter.Bodies.rectangle(300, 150, 100, 40, {
        density: 0.1,
        frictionAir: 0.0
    });
    Matter.Composite.add(engine.world, car);

    // Next let's create some boundaries so the box can't go off the canvas
    ground = Matter.Bodies.rectangle(width / 2, 290, width, 20, { isStatic: true });
    ceiling = Matter.Bodies.rectangle(width / 2, 10, width, 20, { isStatic: true });
    leftWall = Matter.Bodies.rectangle(10, height / 2, 20, height, { isStatic: true });
    rightWall = Matter.Bodies.rectangle(590, height / 2, 20, height, { isStatic: true });
    Matter.Composite.add(engine.world, ground);
    Matter.Composite.add(engine.world, ceiling);
    Matter.Composite.add(engine.world, leftWall);
    Matter.Composite.add(engine.world, rightWall);

    // some landing platforms
    platform1 = Matter.Bodies.rectangle(100, 150, 100, 25, { isStatic: true });
    Matter.Composite.add(engine.world, platform1);

    // randomize the coin position
    randomizeCoin();

    // Matter stores the center point of the body, so we have to use rectMode(CENTER) when drawing
    rectMode(CENTER);
    imageMode(CENTER);
    noStroke();
}

// draw function - used for commands that need to be repeated
function draw() {
    background(0);


    // handle key presses
    // A key - go left
    if (keyIsDown(65)) {
        Matter.Body.applyForce(car, car.position, { x: -0.1, y: 0 });
        currentTaxi = artTaxiLeft;
        particles.push( new Particle(car.position.x+50, car.position.y, {x: random(1,2), y: 0}) );
    }
    // D key - go right
    if (keyIsDown(68)) {
        Matter.Body.applyForce(car, car.position, { x: 0.1, y: 0 });
        currentTaxi = artTaxiRight;
        particles.push( new Particle(car.position.x-50, car.position.y, {x: random(-2,-1), y: 0}) );
    }
    if (keyIsDown(87)) {
        Matter.Body.applyForce(car, car.position, { x: 0, y: -0.1 });
        particles.push( new Particle(car.position.x, car.position.y, {x: 0, y: random(1, 2)} ));
    }
    // D key - go right
    if (keyIsDown(83)) {
        Matter.Body.applyForce(car, car.position, { x: 0, y: 0.1 });
    }

    // speed limit
    let velocityLimitX = constrain(car.velocity.x, -5, 5);
    let velocityLimitY = constrain(car.velocity.y, -5, 5);
    Matter.Body.setVelocity(car, { x: velocityLimitX, y: velocityLimitY });


    // display particles
    for (let i = 0; i < particles.length; i++) {
        let result = particles[i].display();
        if (result) {
            particles.splice(i, 1);
            i--;
        }
    }

    // always force the taxi to a neutral rotation
    Matter.Body.setAngle(car, 0);


    // Draw the box
    fill(255);

    // we will use push and pop to isolate transformations (translate and rotate)
    push();

    // move the origin to the car position and rotate it according to its angle
    translate(car.position.x, car.position.y);
    rotate(car.angle);


    // draw the taxi centered at the origin
    image(currentTaxi, 0, 0, 100, 40);

    // restore transformation matrix
    pop();


    // draw the coin
    fill(255,255,0);
    ellipse(coin.x, coin.y, 10, 10);

    // collision detection 
    if (dist(coin.x, coin.y, car.position.x, car.position.y) < 50) {
        randomizeCoin();
    }



    // Draw the canvas boundaries - we can be lazy here since it doesn't rotate
    fill(128);
    rect(ground.position.x, ground.position.y, width, 20);
    rect(ceiling.position.x, ceiling.position.y, width, 20);
    rect(leftWall.position.x, leftWall.position.y, 20, height);
    rect(rightWall.position.x, rightWall.position.y, 20, height);
    rect(platform1.position.x, platform1.position.y, 100, 25);


    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);
}


function randomizeCoin() {
    coin.x = random(50, width - 50);
    coin.y = random(50, height - 50);
}


class Particle {
    constructor(x,y,speed) {
        this.x = x;
        this.y = y;
        this.size = random(5,15);
        this.speed = speed;
        this.r = random(255);
        this.g = random(255);
        this.b = random(255);
        this.a = 255;
    }
    display() {
        this.x += this.speed.x;
        this.y += this.speed.y;
        this.a -= 5;
        fill(this.r, this.g, this.b, this.a);
        ellipse(this.x, this.y, this.size, this.size);
        if (this.a <= 0) {
            return true;
        }
        return false;
    }
}