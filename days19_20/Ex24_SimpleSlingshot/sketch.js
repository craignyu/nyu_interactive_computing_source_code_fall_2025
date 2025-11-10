let engine;
let ground;
let bird;
let box;
let isDragging = false;
let flying = false;

const anchor = { x: 150, y: 250 };
const BIRD_RADIUS = 16;
const MAX_STRETCH = 140;   // how far back you can pull
const POWER_SCALE = 0.15;  // how strong the launch is (tune this)

let boxes = [];

function setup() {
    createCanvas(800, 400);

    // create our physics engine
    engine = Matter.Engine.create();

    // ground to anchor the world
    ground = Matter.Bodies.rectangle(width / 2, height - 20, width, 40, {
        isStatic: true
    });

    // our "bird" that we will fling using slingshot mechanics
    bird = Matter.Bodies.circle(anchor.x, anchor.y, BIRD_RADIUS, {
        density: 0.004,
        restitution: 0.3
    });

    // add the bird and ground to the world
    Matter.Composite.add(engine.world, [ground, bird]);

    // create some targets
    createTargets();

    rectMode(CENTER);
}

function draw() {
    background(230);
    Matter.Engine.update(engine);

    // Ground
    noStroke();
    fill(100);
    rectMode(CENTER);
    rect(ground.position.x, ground.position.y, width, 40);

    // Slingshot anchor
    fill(90, 60, 30);
    circle(anchor.x, anchor.y, 10);

    // Draw the "band" as just a line between anchor and bird
    if (!flying) {
        stroke(60);
        strokeWeight(4);
        line(anchor.x, anchor.y, bird.position.x, bird.position.y);
    }

    // Bird
    noStroke();
    fill(220, 50, 50);
    ellipse(bird.position.x, bird.position.y, BIRD_RADIUS * 2, BIRD_RADIUS * 2);

    // Target boxes
    for (let b of boxes) {
        push();
        translate(b.position.x, b.position.y);
        rotate(b.angle);
        fill(b.customInfo.red, b.customInfo.green, b.customInfo.blue);
        rect(0, 0, 10, 10);
        pop();
    }

    // UI text
    noStroke();
    fill(20);
    textSize(14);
    text("Drag the bird back and release. Press R to reset.", 16, 20);
}

function mousePressed() {
    const d = dist(mouseX, mouseY, bird.position.x, bird.position.y);

    // Only grab if mouse is close to the bird (and it hasn't flown away)
    if (flying == false && d < BIRD_RADIUS * 1.5) {
        isDragging = true;
    }
}

function mouseDragged() {
    if (!isDragging) return;

    // Vector from anchor to mouse
    let dx = mouseX - anchor.x;
    let dy = mouseY - anchor.y;

    // Limit how far we can pull back
    const distFromAnchor = dist(mouseX, mouseY, anchor.x, anchor.y)
    if (distFromAnchor > MAX_STRETCH) {
        const scale = MAX_STRETCH / distFromAnchor;
        dx *= scale;
        dy *= scale;
    }

    // Put bird at that dragged position
    Matter.Body.setPosition(bird, {
        x: anchor.x + dx,
        y: anchor.y + dy
    });

    // Keep it "stuck" to our drag (no wobble)
    Matter.Body.setVelocity(bird, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(bird, 0);
}

function mouseReleased() {
    if (!isDragging) return;
    isDragging = false;

    // Compute launch vector based on how far from the anchor the bird is
    const dx = bird.position.x - anchor.x;
    const dy = bird.position.y - anchor.y;
    const distFromAnchor = dist(bird.position.x, bird.position.y, anchor.x, anchor.y);

    // Direction from bird back toward anchor (so it flies *away* from anchor)
    const ux = -dx / distFromAnchor;
    const uy = -dy / distFromAnchor;

    // Scale by how far we pulled back
    const strength = distFromAnchor * POWER_SCALE;

    Matter.Body.setVelocity(bird, {
        x: ux * strength,
        y: uy * strength
    });

    // indicate that we are now flying
    flying = true;
}

function keyPressed() {
    if (key === 'R' || key === 'r') {
        // Reset bird to anchor
        Matter.Body.setPosition(bird, { x: anchor.x, y: anchor.y });
        Matter.Body.setVelocity(bird, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(bird, 0);
        flying = false;

        // recreate some targets
        createTargets();
    }
}


function createTargets() {

    // remove any existing targets
    for (let b of boxes) {
        Matter.Composite.remove(engine.world, b);
    }
    boxes = [];

    for (let y = 100; y < 350; y += 10) {
        for (let x = 500; x < 600; x += 10) {
            let tempBox = Matter.Bodies.rectangle(x, y, 10, 10, {
                density: 0.001,
                restitution: 0,
                friction: 0.4
            });
            tempBox.customInfo = {
                red: random(255),
                green: random(255),
                blue: random(255),
                originalX: x,
                originalY: y
            }
            boxes.push(tempBox);
            Matter.Composite.add(engine.world, tempBox);
        }
    }


}