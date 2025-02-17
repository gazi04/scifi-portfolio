import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { TextureLoader } from 'three';
import { AlienStation } from './assets/models/alienStation';

const scene = new THREE.Scene();
const texture = new THREE.TextureLoader().load('assets/milkyWay.jpg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
scene.background = texture;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 20;
camera.position.y = 5;
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

const loader = new GLTFLoader();
let planetGroup = new THREE.Group();
scene.add(planetGroup);
let planet
loader.load(
  "assets/Jupiter.glb",
  function (gltf) {
    planet = gltf.scene;
    
    planet.position.set(0, -10, 0);
    planet.scale.set(0.1, 0.1, 0.1);
    planetGroup.add(planet);

    const alienStation = new AlienStation(scene);
    const stationModel = alienStation.getModel();
    stationModel.scale.set(0.3, 0.3, 0.3);
    stationModel.rotateZ(-1.5);
    stationModel.position.set(10*Math.cos(0), 10*Math.sin(0), 0.5)
    planetGroup.add(stationModel);
    
    console.log("GLB Model Loaded!", planet);
  },
  function (xhr) {
    console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`);
  },
  function (error) {
    console.error("Error loading GLB:", error);
  }
);


const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(10, 10, 10);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

const lightHelper = new THREE.PointLightHelper(light);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

function addStar() {
  const star = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 24, 24), 
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

document.addEventListener("keydown", (event) => {
  let rotationAmount = Math.PI / 8;

  switch (event.code) {
    case "KeyA":
    case "ArrowLeft":
      gsap.to(planetGroup.rotation, { y: planetGroup.rotation.y - rotationAmount, duration: 0.5, ease: "power1.out" });
      break;
    case "KeyD":
    case "ArrowRight":
      gsap.to(planetGroup.rotation, { y: planetGroup.rotation.y + rotationAmount, duration: 0.5, ease: "power1.out" });
      break;
  }
});

// let isDragging = false;
// let previousMousePosition = { x: 0, y: 0 };
//
// document.addEventListener("mousedown", (event) => {
//   isDragging = true;
//   previousMousePosition = { x: event.clientX, y: event.clientY };
// });
//
// document.addEventListener("mousemove", (event) => {
//   if (!isDragging) return;
//
//   let deltaX = event.clientX - previousMousePosition.x;
//   let deltaY = event.clientY - previousMousePosition.y;
//
//   let rotationSpeed = 0.005; 
//
//   gsap.to(planet.rotation, {
//     y: planet.rotation.y + deltaX * rotationSpeed,
//     x: planet.rotation.x + deltaY * rotationSpeed,
//     duration: 0.2, 
//     ease: "power1.out",
//   });
//
//   previousMousePosition = { x: event.clientX, y: event.clientY };
// });
//
// document.addEventListener("mouseup", () => {
//   isDragging = false;
// });
//
// document.addEventListener("mouseleave", () => {
//   isDragging = false;
// });

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
