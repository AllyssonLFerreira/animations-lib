import * as THREE from 'three';

let container = document.getElementById('container')

//PROPERTIES//
let VERTEX_HEIGHT = 15000;
let PLANE_DEFINITION = 100;
let PLANE_SIZE = 1245000;
let BACKGROUND = "#002135";
let MESH_COLOR = "#005e97";
let COUNT = 0;

//global Variables
let scene;
let camera;
let renderer;
let planeGeometry;
let plane;

//init order
initialize();
createPlaneAnimation();
updatePlane();
animate();
window.addEventListener('resize', onWindowResize, false);

// INIT CAMERA //
function initialize() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(BACKGROUND, 1, 300000);

  //cameta variables //
  const FOV = 55;
  const ASPECT_RADIO = window.innerWidth / window.innerHeight;
  const NEAR = 1;
  const FAR = 400000;

  // listener camera 
    camera = new THREE.PerspectiveCamera(FOV, ASPECT_RADIO, NEAR, FAR);
    camera.position.z = 10000;
    camera.position.y = 10000;
    scene.add(camera);
  
  //listener renderer
  renderer = new THREE.WebGLRenderer({alpha: false});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(BACKGROUND, 1);
  container.appendChild(renderer.domElement);

}

function createPlaneAnimation() {
  planeGeometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, PLANE_DEFINITION, PLANE_DEFINITION);
  plane = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({
    color: MESH_COLOR,
    wireframe: true
  }))
  plane.rotation.x -= Math.PI * .5;
  scene.add(plane);
};

function updatePlane() {
  if (planeGeometry && planeGeometry.vertices) {
    for (let i = 0; i < planeGeometry.vertices.length; i++) {
      planeGeometry.vertices[i].z += Math.random() * VERTEX_HEIGHT - VERTEX_HEIGHT;
      planeGeometry.vertices[i]._myZ = planeGeometry.vertices[i].z
    }
  }
 };

 function animate() {
  requestAnimationFrame(animate);
  // camera.position.z -= 150;
  let xPosition = camera.position.x;
  var zPosition = camera.position.z;
  camera.position.x = xPosition * Math.cos(0.001) + zPosition * Math.sin(0.001) - 10;
  camera.position.z = zPosition * Math.cos(0.001) - xPosition * Math.sin(0.001) - 10;
  camera.lookAt(new THREE.Vector3(0, 8000, 0))
 
  if (planeGeometry && planeGeometry.vertices) {
    for (let i = 0; i < planeGeometry.vertices.length; i++) {
      let zPosition = +planeGeometry.vertices[i].z;
      planeGeometry.vertices[i].z = Math.sin(( i * 0.00002)) * (planeGeometry.vertices[i]._myZ - (planeGeometry.vertices[i]._myZ* 0.6))
      plane.geometry.verticesNeedUpdate = true;
   
      COUNT += 0.1
    }
   }
 
  renderer.render(scene, camera);
 }
  
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}