var cam, scene, renderer, controls;
var geometry, material, mesh;
var mouse = {x:0, y:0};
var t = THREE;
var WIDTH = window.innerWidth,
HEIGHT = window.innerHeight,
ASPECT = WIDTH / HEIGHT;
var MOVESPEED = 500;
var LOOKSPEED = 0.09;

var walls = {
  front: {x: -50, y: 0, z: -1000},
  back: {x: -50, y: 0, z: 1000},
  left: {x: -1050, y: 0, z: 0},
  right: {x: 950, y: 0, z: 0}
};

init();
animate();

function init() {

  if(!Detector.webgl) {
    Detector.addGetWebGLMessage(document.body);
  }
    clock = new t.Clock();
    //camera = new t.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    cam = new t.PerspectiveCamera(60, ASPECT, 1, 10000); // Field Of Viw, aspect ratio, near, far
    //camera.position.z = 1000;
    cam.position.z = 700;
    cam.position.y = -100;
    cam.lookAt(new THREE.Vector3(-20, 0, -400));

    t.Object3D._threexDomEvent.camera(cam);
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
	new t.CubeGeometry(2000, 10, 2000),
	new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('Library_Ceiling.jpg')})
    );
    floor.position.x = -50;
    floor.position.y = -650;
    scene.add(floor);

  var ceiling = new t.Mesh(
	new t.CubeGeometry(2000, 10, 2000),
	new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('NYC_ceiling.jpg')/*color:0xFFFFFF*/})
    );
    ceiling.position.x = -50;
    ceiling.position.y = 650;
    scene.add(ceiling);

    var front_wall = new t.Mesh(
	new t.CubeGeometry(2000, 1300, 10),
	new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('library_long_image.jpg')/*color:0xFF0000*/})
    );
    front_wall.position.x = walls.front.x;
    front_wall.position.y = walls.front.y;
    front_wall.position.z = walls.front.z;

    scene.add(front_wall);

    var back_wall = new t.Mesh(
	new t.CubeGeometry(2000, 1300, 10),
	new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('library_long_image.jpg')/*color:0xFF0000*/})
    );
    back_wall.position.x = walls.back.x;
    back_wall.position.y = walls.back.y;
    back_wall.position.z = walls.back.z;

    scene.add(back_wall);

  var left_wall = new t.Mesh(
	new t.CubeGeometry(2000, 1300, 10),
	new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('painting.JPG')/*color:0xFF0000*/})
    );
    left_wall.position.x = walls.left.x;
    left_wall.position.y = walls.left.y;
    left_wall.position.z = walls.left.z;
    left_wall.rotation.y = 1.57;

    scene.add(left_wall);

  var right_wall = new t.Mesh(
	new t.CubeGeometry(2000, 1300, 10),
	new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('library_long_image.jpg')/*color:0xFF0000*/})
    );
    right_wall.position.x = walls.right.x;
    right_wall.position.y = walls.right.y;
    right_wall.position.z = walls.right.z;
    right_wall.rotation.y = -1.57;

    scene.add(right_wall);

    geometry = new t.CubeGeometry(300, 300, 300);

    material = new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('frame.jpg')});
    mesh = new t.Mesh( geometry, material );  // Mesh is the Crate
    mesh.position.z = -100;
    mesh.position.y = -500;

    mesh.rotation.y = Math.random() * Math.PI; 
    scene.add(mesh);

  /*var book = new t.Mesh(
	new t.PlaneGeometry(100, 150),
	new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('Hitchhikers.jpg')/*color:0xFF0000*///})
    //);*/

  var book_material = [
    new t.MeshBasicMaterial({/*map: t.ImageUtils.loadTexture('gitanjali.jpg')*/color: 0xFFFFFF}),
    new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('gitanjali.jpg')}),
    new t.MeshBasicMaterial({/*map: t.ImageUtils.loadTexture('gitanjali.jpg')*/color: 0xFFFFFF}),
    new t.MeshBasicMaterial({/*map: t.ImageUtils.loadTexture('gitanjali.jpg')*/color: 0xFFFFFF}),
    new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('gitanjali.jpg')}),
    new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('gitanjali.jpg')}),
  ];
  var book_cube = new t.CubeGeometry(100, 180, 20, 1, 1, 1, book_material);

  var book = new t.Mesh(book_cube, new t.MeshFaceMaterial());
    book.position.y = -340;
    book.position.z = -100;
    book.rotation.x = -1.57;

    scene.add(book);

    book.on('click',function(e) {
        book.rotation.x = -1.57;
        book.position.y = -340;
	window.open("http://www.archive.org/stream/gitanjalisongoff00tagouoft#page/n9/mode/2up");
    });

    book.on('mouseover', function(e) {
      book.rotation.x = 0;
      book.position.y = -230;
    });

    

    renderer = new t.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

}

function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(animate);

    renderer.render(scene, cam);
    var delta = clock.getDelta();
    controls.update(delta);

}

function onDocumentMouseMove(e) {
    e.preventDefault();
    mouse.x = (e.clientX / WIDTH) * 2 - 1;
    mouse.y = - (e.clientY / HEIGHT) * 2 + 1;
}

