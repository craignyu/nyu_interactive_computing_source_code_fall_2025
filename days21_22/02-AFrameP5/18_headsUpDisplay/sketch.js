// variable to hold a reference to our A-Frame world
let world;

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

    // create some heads up display entities
    // these entities will always be visible to the user, and will by default be placed
    // at 1 meter in front of the camera (Z = -1)
    let redPlaneHUD = new AFrameP5.Plane({
        red: 255, green: 0, blue: 0,
        width: 0.2, height: 0.2,
        clickFunction: function(button) {
            // on click, spin the plane a little bit
            button.spinZ(22.5);
        }
    });

    // here we are choosing to add the item to the HUD at (-0.5, -0.5, -1)
    world.addToHUD(redPlaneHUD, -0.5, -0.5);  


    // this will be our second HUD item
    let greenPlaneHUD = new AFrameP5.Plane({
        red: 0, green: 255, blue: 0,
        width: 0.2, height: 0.2,
        clickFunction: function(button) {
            // on click, spin the plane a little bit
            button.spinZ(22.5);
        }
    });

    // this HUD item will be at (0, -0.5, -1)
    world.addToHUD(greenPlaneHUD, 0, -0.5);


    // our third HUD item will be placed at a different Z position
    let bluePlaneHUD = new AFrameP5.Plane({
        red: 0, green: 0, blue: 255,
        width: 0.2, height: 0.2,
        clickFunction: function(button) {
            // on click, spin the plane a little bit
            button.spinZ(22.5);
        }        
    });

    // this HUD item will be at (0.5, -0.5, -1.1) since we are forcing it
    // to use a different Z position than the default -1
    world.addToHUD(bluePlaneHUD, 0.5, -0.5, -1.1);


    // HUD items can also be placed at any position by initializing them with
    // a known position and NOT specifying a position when adding them to the HUD
    // you will need to keep in mind that the HUD elements are always
    // relatively positioned to the user's camera position, though
    let yellowPlaneHUD = new AFrameP5.Plane({
        red: 255, green: 255, blue: 0,
        x: 0, y: 0.5, z: -1.5,
        width: 0.2, height: 0.2,
        clickFunction: function(button) {
            // on click, spin the plane a little bit
            button.spinZ(22.5);
        }        
    });   

    // no position specified here, so the entity will use its own position
    world.addToHUD(yellowPlaneHUD);

    // entities can also be removed from the HUD
    world.removeFromHUD(bluePlaneHUD);


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

function draw() {

    // you can also adjust the Z-distance of all HUD entities
    // as a group. note that doing this will overwrite any custom
    // Z-distances you've set on HUD entities, and will force any
    // future HUD elements to use this new Z-distance

    /*
    let newZDistance = map(mouseX, 0, windowWidth, -1.5, -0.5);
    console.log(newZDistance);

    world.setHUDDistance(newZDistance);
    */
}