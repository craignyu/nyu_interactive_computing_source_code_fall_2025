// character position
let xPos, yPos;

// character speed
let xSpeed, ySpeed;

// acceleration value (something VERY small)
let accel = 0.1;

// coin position
let xCoin, yCoin;

// coin artwork
let coinArtwork;

// points
let points = 0;

function preload() {
  coinArtwork = loadImage('../images/coin.png');
}

function setup() {
  createCanvas(500, 500);

  // default position to the middle of the screen
  xPos = 250;
  yPos = 250;

  // where is the coin?
  xCoin = random(25, width - 25);
  yCoin = random(25, height - 25);

  fill(255);
  noStroke();
  imageMode(CENTER);
}

function draw() {
  background(0, 30);

  // display points
  text("Points: " + points, 20, 20);

  // move the character based on the mouse position
  xPos = lerp(xPos, mouseX, 0.05);
  yPos = lerp(yPos, mouseY, 0.05);

  // COLLISION DETECTION
  if (dist(xPos, yPos, xCoin, yCoin) < 25) {
    // collision happened, move the coin
    xCoin = random(25, width - 25);
    yCoin = random(25, height - 25);

    // give the user a point
    points += 1;
  }

  // draw the coin
  imageMode(CENTER)
  image(coinArtwork, xCoin, yCoin);

  // draw the character
  ellipse(xPos, yPos, 25, 25);

}
