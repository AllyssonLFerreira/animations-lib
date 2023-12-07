import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//global Variables
let scene;
let camera;
let renderer;
let circle;
let skeleton;
let particle;

//function
function init(){
  //scene
  scene = new THREE.Scene();
  
  //camera Variables
  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 10000;
  
  // camera
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 500;
  scene.add(camera);
  
  //renderer
  renderer = new THREE.WebGLRenderer({
    antialias:true,
    alpha:true
  })
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);
  document.getElementById('canvas').appendChild(renderer.domElement);
  
  //3d object
  circle = new THREE.Object3D();
  skeleton = new THREE.Object3D();
  particle = new THREE.Object3D();
  
  scene.add(circle);
  scene.add(skeleton);
  scene.add(particle);
  
  //adding Geometry
  let comets = new THREE.TetrahedronGeometry(3,1);
  let core = new THREE.IcosahedronGeometry(7,1);
  let sphere = new THREE.IcosahedronGeometry(15,6);
  
  //Material
  let material = new THREE.MeshPhongMaterial({
    color: 0x161616,
    shading: THREE.FLatShading
  });
  
  let mat = new THREE.MeshPhongMaterial({
    color: 0x4a4a4a,
    side: THREE.DoubleSide,
    wireframe: true,
  });
  
   let mat2 = new THREE.MeshPhongMaterial({
    color: 0x161616,
    side: THREE.DoubleSide,
    wireframe: true,
  });
  
  //Particle
  for(let i = 0; i < 1000; i++){
    let mesh = new THREE.Mesh(comets, mat2);
    mesh.position.set(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    );
    mesh.position.multiplyScalar(1200 + (Math.random()*900));
    mesh.rotation.set(
      Math.random() * 3,14,
      Math.random() * 3,14,
      Math.random() * 3,14
    );
    particle.add(mesh);
  }
  
  //innerplanet
  let innerPlanet = new THREE.Mesh(core, material);
  innerPlanet.scale.x = innerPlanet.scale.y = innerPlanet.scale.z = 16;
  circle.add(innerPlanet);
  
  //outerPlanet
  let outerPlanet = new THREE.Mesh(sphere, mat);
  outerPlanet.scale.x = outerPlanet.scale.y = outerPlanet.scale.z = 11;
  skeleton.add(outerPlanet);
  
  //ambientLight
  let ambientLight = new THREE.AmbientLight(0xd4d4d4);
  scene.add(ambientLight);
  
  // directional light
    let dLight = [];
    dLight[0] = new THREE.DirectionalLight(0xFFC7C7, 6);
    dLight[0].position.set(1, 0, 0);
    dLight[1] = new THREE.DirectionalLight(0xED9ED6, 6);
    dLight[1].position.set(0.75, 1, 0.5);
    dLight[2] = new THREE.DirectionalLight(0xC683D7, 6);
    dLight[2].position.set(-0.75, -1, 0.5);
    scene.add(dLight[0]);
    scene.add(dLight[1]);
    scene.add(dLight[2]);

    animate();
    window.addEventListener('resize', onWindowResize, false);
  
}

function animate() {
    requestAnimationFrame(animate);

    particle.rotation.x += 0.0000;
    particle.rotation.y -= 0.0024;
    particle.rotation.z -= 0.0012;

    circle.rotation.x -= 0.0016;
    circle.rotation.y -= 0.0016;

    skeleton.rotation.x +=  0.0020;
    skeleton.rotation.y +=  0.0020;

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.onload = init;
