// see the 'index.html' file in this sketch folder - it contains a
// div named '#p5_loading' - this div will be displayed while the
// preload() function is operating - once it completes the div will
// automatically be hidden

function preload() {
    for (let j = 1; j < 6; j++) {
        for (let i = 0; i < 49; i++) {
            loadImage('../images/preloaderImages/images' + j + '/' + i + '.png');
        }
    }
}

function setup() {
    // setup the canvas and center it horizontally
    let theCanvas = createCanvas(500, 500);
    theCanvas.style('display', 'block');
    theCanvas.style('margin', 'auto');
    background(0);
}

function draw() {
    let s = random(10, 30);
    fill(random(255), random(255), random(255));
    ellipse(random(width), random(height), s, s);
}
