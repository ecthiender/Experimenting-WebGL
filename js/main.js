//(function(G) {
/* global vars */
var t = THREE,
ASPECT = window.innerWidth / window.innerHeight,
MOVESPEED = 3,
ACTUAL_LOOK_SPEED = 1;

var mouse = new t.Vector2();
var objects = [];
var obj, INTERSECTED, SELECTED;
G.meshes = [];

// the books db
// @faces : array
//  faces[2]: spine image, faces[1]: back cover, faces[0]: front cover
G.books_db = [];

G.init = function(result) {
  $('#loading').html('');
  this.clock = new t.Clock();
  this.deltaX = 0;
  this.thetaD = 0;
  this.old_mouseX = 0;

  //this.scene = new t.Scene();
  this.scene = result.scene;

  /* Camera!! */
  this.cam = new t.PerspectiveCamera(60, ASPECT, 0.1, 1000);

  //this.cam  = t.Object3D._threexDomEvent.camera(this.cam);
  
  this.controls = new t.FirstPersonControls(this.cam);
  this.controls.movementSpeed = MOVESPEED;

  this.scene.add(this.cam);
  this.cam.position.set(7, 2, -1);

  /*Projector*/
  this.projector = new t.Projector();
  
  /* Lights!! */
  this.light = new t.PointLight(0xffffff, 0.8, 100); 
  this.light.position.set(0, -20, 0);
  this.scene.add(this.light);


  obj = this;
  this.renderer = new t.WebGLRenderer({antialias: true});
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
  this.renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
  document.body.appendChild(this.renderer.domElement);

  /* necessary event listeners */
  function bind(scope, fn) {
    return function() {
      fn.apply(scope, arguments);
    }
  }

  function onDocumentMouseDown( event ) {

    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    console.log(mouse);
    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    obj.projector.unprojectVector( vector, obj.cam );

    var raycaster = new THREE.Raycaster( obj.cam.position, vector.subSelf( obj.cam.position ).normalize() );

    var intersects = raycaster.intersectObjects( objects, true );
    if ( intersects.length > 0 ) {

      obj.controls.enabled = false;

      SELECTED = intersects[ 0 ].object;

      //console.log(SELECTED.url);
      
      window.open(SELECTED.url);
      // var intersects = raycaster.intersectObject( plane );
      // offset.copy( intersects[ 0 ].point ).subSelf( plane.position );

      // container.style.cursor = 'move';

    }

  }

  function onDocumentMouseUp( event ) {

    event.preventDefault();

    obj.controls.enabled = true;

    if ( INTERSECTED ) {

      plane.position.copy( INTERSECTED.position );

      SELECTED = null;

    }

    // container.style.cursor = 'auto';

  }
  
  document.addEventListener('mousemove', bind(this, G.onMouseMove), false);
  window.addEventListener('resize', G.onWindowResize, false);

  /* Action! */
  this.render();


  this.loadBooks();
};

G.render = function() {
  requestAnimationFrame(G.render);
  G.fixMouseMove();
  G.renderer.render(G.scene, G.cam);
  G.controls.update(G.clock.getDelta());
};

/* execution starts from here */
G.load = function() {
  if(!Detector.webgl) {
    Detector.addGetWebGLMessage(document.body);
    console.log('Could not detect WebGL. Quitting!');
    return;
  }
  new t.SceneLoader().load('scenes/scene-ver4.js', function(result) {
    //console.log('"the" scene js file ', result);
    G.init(result);
  });
};

G.onWindowResize = function() {
  G.cam.aspect = window.innerWidth / window.innerHeight;
  G.cam.updateProjectionMatrix();
  G.renderer.setSize(window.innerWidth, window.innerHeight);
};

G.onMouseMove = function(event) {
  G.deltaX = event.clientX - G.old_mouseX;
  G.old_mouseX = event.clientX;
};

// stop spinning the mouse forever on mouse move
G.fixMouseMove = function() {
  G.thetaD -= G.deltaX * ACTUAL_LOOK_SPEED;
  var theta = G.thetaD * Math.PI / 180;
  var lookpoint = new t.Vector3(0, 0, 0);
  lookpoint.set(Math.sin(theta), 0, Math.cos(theta));
  lookpoint.addSelf(G.cam.position);
  G.cam.lookAt(lookpoint);
  G.deltaX = 0;
};

G.loadBooks = function() {
  $.getJSON('books/books.json', function(books) {
    G.books_db = books;
    G.initBooks();
  });
};

G.initBooks = function() {
  for(var i = 0; i < this.books_db.length; i++) {
    var dim = this.books_db[i].dimensions;
    var faces = this.books_db[i].faces;
    var pos = this.books_db[i].position;
    var rot = this.books_db[i].rotation;
    var maps = [
      new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture(faces[0])}), 
      new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture(faces[1])}), 
      new t.MeshBasicMaterial({color: '0xffffff'}),
      new t.MeshBasicMaterial({color: '0xffffff'}),
      new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture(faces[2])}),
      new t.MeshBasicMaterial({color: '0xffffff'})
    ];
    var mesh = new t.Mesh(
      new t.CubeGeometry(dim[0], dim[1], dim[2]),
      new t.MeshFaceMaterial(maps)
    );
    mesh.position.set(pos[0], pos[1], pos[2]);
    if(rot) {
      mesh.rotation.set(rot[0], rot[1], rot[2]);
    }
    else {
      mesh.rotation.set(0, 1.57, 0);
    }
    mesh.url = this.books_db[i].url;
    //mesh.geometry.computeCentroids();
    //mesh.on('click', G.onBookClick);
    this.meshes.push(mesh);
    objects.push(mesh);
    this.scene.add(mesh);
  }
};

G.onBookClick = function(event) {
  // get the book.URL and open it in a new window
  console.log(event);
}
//)(G);
