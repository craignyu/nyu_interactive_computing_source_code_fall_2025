// variable to hold a reference to our A-Frame world
let world;

function setup() {
    // no canvas needed
    noCanvas();

    // construct the A-Frame world
    // this function requires a reference to the ID of the 'a-scene' tag in our HTML document
    world = new AFrameP5.World('VRScene');

    let b = new AFrameP5.Box({
        red: 255, green: 0, blue: 0,
        z: -5
    });

    world.add(b);
}

function draw() {

}
