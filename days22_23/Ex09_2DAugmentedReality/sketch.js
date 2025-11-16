// create a let iable to hold our world object
let world;

// create let iables to hold our markers
let markerHiro;

// where our player is current hanging out at
let playerX, playerY;

// artwork for our player
let playerArtwork;

// this is a major hack, but if you plan on using getScreenPosition on a mobile device you have to load an image or other media file here
// the reason has to do with the fact that the AR.js camera system takes some time to initialize, and this process pauses while the user
// is providing their consent to turn on their camera via a pop-up box.  however, p5 will continue executing behind the scenes and will set
// up its end of the AR world wtihout AR.js.  using 'preload' will pause p5's startup routine until after the user clicks to allow access to
// their camera, thus bringing the system back into balance.
// as mentioned, this is a hack, but I'm working on fixing it for the next version of the library!
function preload() {
    loadImage('../images/stonebrick_mossy.png');
}

function setup() {
    // create our world (this also creates a p5 canvas for us)
    world = new AFrameP5AR.World('ARScene');

    // grab a reference to our two markers that we set up on the HTML side (connect to it using its 'id')
    markerHiro = world.getMarker('hiro');

    // place the player in the middle of the screen
    playerX = width / 2;
    playerY = height / 2;
}


function draw() {
    // erase the background
    world.clearDrawingCanvas();

    // use the markers as positional controllers
    if (markerHiro.isVisible() == true) {
        // get the position of this marker
        let hiroPosition = markerHiro.getScreenPosition();

        // draw an ellipse here
        fill(0, 255, 0);
        stroke(0);
        strokeWeight(5);
        ellipse(hiroPosition.x, hiroPosition.y, 50, 50);
        strokeWeight(1);
        text("Hiro marker: " + int(hiroPosition.x) + ", " + int(hiroPosition.y), hiroPosition.x, hiroPosition.y + 50);
    }

}