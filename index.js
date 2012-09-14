var cam, scene, renderer, controls;
var geometry, material, mesh;
var mouse = {x:0, y:0};
var t = THREE;
var WIDTH = window.innerWidth,
HEIGHT = window.innerHeight,
ASPECT = WIDTH / HEIGHT;
var MOVESPEED = 500;
var LOOKSPEED = 0.005;

var walls = {
  front: {x: -50, y: 0, z: -650},
  back: {x: -50, y: 0, z: 650},
  left: {x: -700, y: 0, z: 0},
  right: {x: 600, y: 0, z: 0}
};

init();
animate();

function init() {
    
    clock = new t.Clock();
    //camera = new t.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    cam = new t.PerspectiveCamera(60, ASPECT, 1, 10000); // Field Of Viw, aspect ratio, near, far
    //camera.position.z = 1000;
    cam.position.z = 500;
    
    
    // Camera moves with mouse, flies around with WASD/arrow keys
    controls = new t.FirstPersonControls(cam); // Handles   camera control
    controls.movementSpeed = MOVESPEED; // How fast the pl ayer can walk around
    controls.lookSpeed = LOOKSPEED; // How fast the p  layer can look around with the mouse
    controls.lookVertical = false; //   Don't allow the player to look up or down. This is a temporary fix to keep people from flying
    controls.noFly = true; // Don't allow hitting R or F to g  o up or down
    
    var UNITSIZE = 100;
    var units = 1;
    scene = new t.Scene();

    scene.add(cam);
    var floor = new t.Mesh(
	new t.CubeGeometry(1300, 10, 1300),
	new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('brick.jpg')/*color:0xEABCDE*/})
    );
    floor.position.x = -50;
    floor.position.y = -300;
    scene.add(floor);

  var ceiling = new t.Mesh(
	new t.CubeGeometry(1300, 10, 1300),
	new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('ceiling1.jpg')/*color:0xFFFFFF*/})
    );
    ceiling.position.x = -50;
    ceiling.position.y = 300;
    scene.add(ceiling);

    var front_wall = new t.Mesh(
	new t.CubeGeometry(1300, 1300, 10),
	new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('brick.jpg')/*color:0xFF0000*/})
    );
    front_wall.position.x = walls.front.x;
    front_wall.position.y = walls.front.y;
    front_wall.position.z = walls.front.z;

    scene.add(front_wall);

    var back_wall = new t.Mesh(
	new t.CubeGeometry(1300, 1300, 10),
	new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('brick.jpg')/*color:0xFF0000*/})
    );
    back_wall.position.x = walls.back.x;
    back_wall.position.y = walls.back.y;
    back_wall.position.z = walls.back.z;

    scene.add(back_wall);

  var left_wall = new t.Mesh(
	new t.CubeGeometry(1300, 1300, 10),
	new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('brick.jpg')/*color:0xFF0000*/})
    );
    left_wall.position.x = walls.left.x;
    left_wall.position.y = walls.left.y;
    left_wall.position.z = walls.left.z;
    left_wall.rotation.y = 1.57;

    scene.add(left_wall);

  var right_wall = new t.Mesh(
	new t.CubeGeometry(1300, 1300, 10),
	new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('brick.jpg')/*color:0xFF0000*/})
    );
    right_wall.position.x = walls.right.x;
    right_wall.position.y = walls.right.y;
    right_wall.position.z = walls.right.z;
    right_wall.rotation.y = -1.57;

    scene.add(right_wall);

    geometry = new t.CubeGeometry(100, 100, 100);

    material = new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('crate.jpg')});
    mesh = new t.Mesh( geometry, material );  // Mesh is the Crate
    mesh.position.z = 100;
    mesh.position.y = -130;

    mesh.rotation.y = Math.random() * Math.PI; 
    scene.add(mesh);
    mesh.on('click',function(e)
    	    {
		
    		console.log(e.target);
    	    });

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    renderer = new t.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

}

function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(animate);

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;
    renderer.render(scene, cam);
    var delta = clock.getDelta();
    controls.update(delta);

}

function onDocumentMouseMove(e) {
    
    e.preventDefault();
    mouse.x = (e.clientX / WIDTH) * 2 - 1;
    mouse.y = - (e.clientY / HEIGHT) * 2 + 1;
}

// function onDocumentMouseClick(e){
    
//     e.preventDefault();
    