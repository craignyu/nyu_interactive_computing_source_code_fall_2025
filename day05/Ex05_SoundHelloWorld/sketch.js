// declare a holder letiable for our sound
let song;

function preload() {
  // preload our sound
  song = loadSound("../sounds/pokemon_theme.mp3");
}

function setup() {
  createCanvas(100, 100);

  // play our sound when the sketch starts
  song.play();

  background(0);
  fill(255);
  text("Listen!", 20, 20);
}

function draw() {
}
