// variable to hold a reference to our A-Frame world
let world;

// offset variables to keep track of where to draw the collected cubes
let offsetX = 0;
let offsetY = 0;
let boxSize = 32;

function setup() {
    // no canvas needed
    noCanvas();

    // construct the A-Frame world
    // this function requires a reference to the ID of the 'a-scene' tag in our HTML document
    world = new AFrameP5.World('VRScene');

    // set a background color for the world using RGB values
    world.setBackground(173, 216, 230);

    // disallow flying
    world.setFlying(false);

    // a graphics buffer to act as our dynamic HUD display
    let buffer = createGraphics(512, 512);
    buffer.background(255);
    let texture = world.createDynamicTextureFromCreateGraphics(buffer);

    // add a new Plane to our HUD using the buffer as its texture
    let hudPlane = new AFrameP5.Plane({
        x: 1,
        y: 0,
        z: -1,
        dynamicTexture: true,
        dynamicTextureWidth: 512,
        dynamicTextureHeight: 512,
        asset: texture
    });
    world.addToHUD(hudPlane);

    // create a large number of cubes that the player can collect
    for (let i = 0; i < 100; i++) {

        world.add( new AFrameP5.Box({
            x: random(-48,48),
            y: 0.5,
            z: random(-48,48),
            red: random(255),
            green: random(255),
            blue: random(255),

            // every cube has its own customData object
            // here we are having each cube remember if it has been collected or not
            customData: {
                collected: false
            },

            // this function runs once a frame (like draw)
            tickFunction: function(box) {

                // if this box has already been collected, don't do anything
                if (box.customData.collected) {
                    return;
                }

                // figure out the user's position and the box position
                const userPosition = world.getUserPosition();
                const myPosition = box.getPosition();

                // see how far apart they are
                if (dist(userPosition.x, userPosition.z, myPosition.x, myPosition.z) < 1) {

                    // if they are close, mark the box as collected
                    box.customData.collected = true;

                    // draw a colored rectangle on the buffer to signify this box
                    buffer.fill( box.getRed(), box.getGreen(), box.getBlue() );
                    buffer.rect(offsetX, offsetY, boxSize, boxSize);

                    // move the offset variable over / down so that we can draw the next
                    // box onto the buffer
                    offsetX += boxSize;
                    if (offsetX >= 512) {
                        offsetX = 0;
                        offsetY += boxSize;
                    }

                    // remove the box from the world
                    world.remove(box);
                }
            }
        }) );
    }

    // create a plane to serve as our "ground"
    let g = new AFrameP5.Plane({
        x: 0, y: 0, z: 0,
        width: 100, height: 100,
        asset: 'stone',
        repeatX: 100,
        repeatY: 100,
        rotationX: -90
    });

    // add the plane to our world
    world.add(g);
}