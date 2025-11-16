// create a variable to hold our world object
let world;

// create a variable to hold our marker
let marker;

// create variables to hold each cube
let littleCube1, littleCube2, littleCube3, littleCube4, littleCube5;

// movement speeds for the other cubes
let movementSpeed = 0.01;

function setup() {
    // create our world (this also creates a p5 canvas for us)
    world = new AFrameP5AR.World('ARScene');

    // grab a reference to the marker that we set up on the HTML side (connect to it using its 'id')
    marker = world.getMarker('hiro');

    // this object has its own "customData" object to keep track of values it will need during its lifecycle
    // it also has a "tickFunction" which will be run 1x per frame
    // this function can access the "customData" object using the function argument and adjust it accordingly
    littleCube1 = new AFrameP5AR.Box({
        x: -0.5, y: 0.25, z: -0.5,
        red: 255, green: 0, blue: 0,
        width: 0.5, height: 0.5, depth: 0.5,
        asset: 'stonebrick',
        customData: {
            mySpeed: 0.01
        },
        tickFunction: function(entity) {
            entity.nudge(0, entity.customData.mySpeed, 0);
            const myCurrentYPosition = entity.getY();
            if (myCurrentYPosition > 1 || myCurrentYPosition < 0.25) {
                entity.customData.mySpeed *= -1;
            }
        }        
    });
    marker.addChild(littleCube1);

    // this function operates the same way as the one above, but moves independently with its own data
    // this object also changes color every times it bounces
    littleCube2 = new AFrameP5AR.Box({
        x: 0, y: 0.25, z: 0,
        red: 0, green: 255, blue: 0,
        width: 0.5, height: 0.5, depth: 0.5,
        asset: 'stonebrick',
        customData: {
            mySpeed: -0.01
        },
        tickFunction: function(entity) {
            entity.nudge(0, 0, entity.customData.mySpeed);
            const myCurrentZPosition = entity.getZ();
            if (myCurrentZPosition > 0.5 || myCurrentZPosition < -0.5) {
                entity.customData.mySpeed *= -1;

                // change color
                entity.setRed( random(255) );
                entity.setGreen( random(255) );
                entity.setBlue( random(255) );
            }
        }
    });
    marker.addChild(littleCube2);
}


function draw() {

}
