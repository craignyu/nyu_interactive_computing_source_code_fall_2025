// create a variable to hold our world object
let world;

// create variables to hold our markers
let markerHiro, markerKanji;

function setup() {
    // create our world (this also creates a p5 canvas for us)
    world = new AFrameP5AR.World('ARScene');

    // grab a reference to our two markers that we set up on the HTML side (connect to it using its 'id')
    markerHiro = world.getMarker('hiro');
    markerKanji = world.getMarker('kanji');
}


function draw() {
    // erase the background
    world.clearDrawingCanvas();

    // use the markers as identity controllers
    if (markerHiro.isVisible() == true) {
        fill(255);
        textSize(50);
        textAlign(CENTER);
        text("Hiro is visible", width / 2, height / 2);
    }
    if (markerKanji.isVisible() == true) {
        fill(255);
        textSize(50);
        textAlign(CENTER);
        text("Kanji is visible", width / 2, height / 2 + 50);
    }
}
