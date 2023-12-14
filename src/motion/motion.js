import * as THREE from 'three';

var camera, scene, renderer;
var width = window.innerWidth;
var height = window.innerHeight;
var particles, particleSystem;
var particleCount = 5000;

function init() {
    camera = new THREE.PerspectiveCamera(80, width / height, 1, 4000);
    camera.position.z = 3000;

    scene = new THREE.Scene();
    scene.add(camera);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    document.body.appendChild(renderer.domElement);

    makeParticles();
}

function makeParticles() {
    var material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 20
    });

    particles = new THREE.BufferGeometry();

    var positions = new Float32Array(particleCount * 3);

    for (var i = 0; i < particleCount; i++) {
        var i3 = i * 3;
        positions[i3] = Math.random() * 3000 - 1500;
        positions[i3 + 1] = Math.random() * 3000 - 1500;
        positions[i3 + 2] = Math.random() * 3000 - 1500;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    particleSystem = new THREE.Points(particles, material);

    scene.add(particleSystem);
}

function render() {
    var object = scene.children[1];

    object.rotation.x -= Math.random() * 0.001 - 0.005;
    object.rotation.y -= Math.random() * 0.001 - 0.005;
    object.rotation.z -= Math.random() * 0.001 - 0.005;

    renderer.render(scene, camera);
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    render();
}

window.onload = function () {
    init();
    animateParticles();
};
