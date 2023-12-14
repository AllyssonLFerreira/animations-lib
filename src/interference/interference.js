import {OrbitControls} from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import * as THREE from 'three';

console.clear();

//properties
let FIELD_OF_VIEW = 50;
let ASPECT_RATIO = innerWidth / innerHeight;
let NEAR = 2;
let FAR = 1000;

//DIMENSIONS
let inWidth = innerWidth;
let inHeight = innerHeight;
let posX = 50;
let posY = 0;
let posZ = 90;
let animationUniforms = { time: { value: 0 } };


//Properties_THREE
let scene;
let camera;
let renderer;
//let controls;
let clock;
let points;
let geometry;
let materialPoints;

initialize();
function initialize() {
  listenerScene();
  onWindowResize();
  orbitsAnimate();
}

function listenerScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x181818);

  camera = new THREE.PerspectiveCamera(FIELD_OF_VIEW, ASPECT_RATIO, NEAR, FAR);
  camera.position.set(posX, posY, posZ);

  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  renderer = new THREE.WebGLRenderer({canvas});
  renderer.setSize(inWidth, inHeight);
}

function onWindowResize() {
  window.addEventListener("resize", event => {
    camera.aspect = inWidth / inHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(inWidth, inHeight);
  })
}

function orbitsAnimate() {
/*  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;*/

  const {particles, sizes, shift } = createParticles();
  createGeometry(particles, sizes, shift)

  materialPoints = new THREE.PointsMaterial({
    size: 0.125,
    transparent: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    onBeforeCompile: shader => {
      shader.uniforms.time = animationUniforms.time;
      shader.vertexShader = `
      uniform float time;
      attribute float sizes;
      attribute vec4 shift;
      varying vec3 vColor;
      ${shader.vertexShader}
    `.replace(
          `gl_PointSize = size;`,
          `gl_PointSize = size * sizes;`
      ).replace(
          `#include <color_vertex>`,
          `#include <color_vertex>
        float d = length(abs(position) / vec3(24., 24., 24));
        d = clamp(d, -1., 2.);
        vColor = mix(vec3(176., 6., 0.), vec3(49., 48., 77.), d) / 235.;
      `
      ).replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
        float t = time;
        float moveT = mod(shift.x + shift.z * t, PI2);
        float moveS = mod(shift.y + shift.z * t, PI2);
        transformed += vec3(cos(moveS) * sin(moveT), cos(moveT), sin(moveS) * sin(moveT)) * shift.w;
      `
      );
      shader.fragmentShader = `
      varying vec3 vColor;
      ${shader.fragmentShader}
    `.replace(
          `#include <clipping_planes_fragment>`,
          `#include <clipping_planes_fragment>
        float d = length(gl_PointCoord.xy - 0.5);
        //if (d > 0.5) discard;
      `
      ).replace(
          `vec4 diffuseColor = vec4( diffuse, opacity );`,
          `vec4 diffuseColor = vec4( vColor, smoothstep(0.5, 0.1, d)/* * 0.5 + 0.5*/ );`
      );
    }
  });

  createPoints(geometry, materialPoints)
  scene.add(points)
  clock = new THREE.Clock();
  render();
}

function createGeometry(particles, sizes, shift) {
  geometry = new THREE.BufferGeometry().setFromPoints(particles);
  geometry.setAttribute("sizes", new THREE.Float32BufferAttribute(sizes, 1));
  geometry.setAttribute("shift", new THREE.Float32BufferAttribute(shift, 4));
}

function createPoints(geometry, materialPoints) {
  points = new THREE.Points(geometry, materialPoints);
  points.rotation.order = "ZYX";
  points.rotation.z = 0.2;
}

function createParticles() {
  let sizes = [];
  let shift = [];

  const pushShift = () => {
    shift.push(
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2,
        Math.random() * 0.1,
        Math.random() * 0.1
    );
  };

  let particles = [];
  let numWaves = 10; // Ajuste conforme necessário

  for (let i = 0; i < numWaves; i++) {
    // Número de partículas por onda
    let numParticlesInWave = 500000;

    for (let j = 0; j < numParticlesInWave; j++) {
      sizes.push(Math.random() * 1.2 + 0.2);
      pushShift();
      const radius = Math.random() * 10 + 45;

      // Para obter uma distribuição mais esférica, ajuste as fórmulas abaixo
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) + i * 8;
      const z = radius * Math.cos(phi);

      particles.push(new THREE.Vector3(x, y, z));
    }
  }

  return { particles, sizes, shift };
}

function render() {
  renderer.setAnimationLoop(() => {
    /*controls.target.x = 50;
    controls.update();*/
    const elapsedTime = clock.getElapsedTime() * 0.5;
    animationUniforms.time.value = elapsedTime * Math.PI;
    points.rotation.x = elapsedTime * 0.5;
    renderer.render(scene, camera);
  });
}

