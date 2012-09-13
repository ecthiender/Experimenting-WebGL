var cam, scene, renderer;
var geometry, material, mesh;
var mouse = {x:0, y:0};
var t = THREE;
var WIDTH = window.innerWidth,
HEIGHT = window.innerHeight,
ASPECT = WIDTH / HEIGHT;
var MOVESPEED = 100;
var LOOKSPEED = 0.075;

init();
animate();

function init() {
    
    clock = new t.Clock();
    //camera = new t.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    cam = new t.PerspectiveCamera(60, ASPECT, 1, 10000); // Field Of Viw, aspect ratio, near, far
    //camera.position.z = 1000;
    cam.position.z = 1000;
    
    
    // Camera moves with mouse, flies around with WASD/arrow keys
    controls = new t.FirstPersonControls(cam); // Handles   camera control
    controls.movementSpeed = MOVESPEED; // How fast the pl ayer can walk around
    controls.lookSpeed = LOOKSPEED; // How fast the p  layer can look around with the mouse
    controls.lookVertical = false; //   Don't allow the player to look up or down. This is a temporary fix to keep people from flying
    controls.noFly = false; // Don't allow hitting R or F to g  o up or down
    
    var UNITSIZE = 100;
    var units = 1;
    scene = new t.Scene();

    scene.add(cam);
    var floor = new t.Mesh(
	new t.CubeGeometry(1300, 10, 1300),
	new t.MeshBasicMaterial({/*map: t.ImageUtils.loadTexture('brick.jpg')*/color:0xEABCDE})
    );
    floor.position.x = -50;
    floor.position.y = -300;
    scene.add(floor);

  var celing = new t.Mesh(
	new t.CubeGeometry(1300, 10, 1300),
	new t.MeshBasicMaterial({/*map: t.ImageUtils.loadTexture('brick.jpg')*/color:0xEABCDE})
    );
    celing.position.x = -50;
    celing.position.y = 300;
    scene.add(celing);

    var walls = new t.Mesh(
	new t.CubeGeometry(4500, 3700, 10),
	new t.MeshBasicMaterial({/*map: t.ImageUtils.loadTexture('brick.jpg')*/color:0xFF0000})
    );
    walls.position.x = -500;
    walls.position.y = -50;
    walls.position.z = -50;

    scene.add(walls);

    geometry = new t.CubeGeometry( 200, 200, 200 );

    material = new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('crate.jpg')});
    mesh = new t.Mesh( geometry, material );
    mesh.position.z = 100;
    mesh.position.y = -300;

    mesh.rotation.y = Math.random() * Math.PI; 
    scene.add(mesh);

    // var directionalLight1 = new t.DirectionalLight( 0xF7EFBE, 0.7 );
    // directionalLight1.position.set( 0.5, 1, 0.5 );
    // scene.add( directionalLight1 );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    renderer = new t.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

}

function animate() {

        // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;


   renderer.render( scene, cam );

}

function onDocumentMouseMove(e) {
    
    e.preventDefault();
    mouse.x = (e.clientX / WIDTH) * 2 - 1;
    mouse.y = - (e.clientY / HEIGHT) * 2 + 1;
}