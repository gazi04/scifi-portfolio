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
const alienStation = new AlienStation(scene);
const stationModel = alienStation.getModel();
let planetGroup = new THREE.Group();
scene.add(planetGroup);
let planet
let boxHelper;
loader.load(
  "assets/Jupiter.glb",
  function (gltf) {
    planet = gltf.scene;

    planet.position.set(0, -10, 0);
    planet.scale.set(0.1, 0.1, 0.1);
    planetGroup.add(planet);

    stationModel.scale.set(0.3, 0.3, 0.3);
    stationModel.rotateZ(-1.5);
    stationModel.position.set(10*Math.cos(0), 10*Math.sin(0), 0.5)
    planetGroup.add(stationModel);

    boxHelper = new THREE.BoxHelper(stationModel);
    scene.add(boxHelper);

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

// Raycaster for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  // Convert mouse position to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections with the station model
  const intersects = raycaster.intersectObject(stationModel, true);
  console.log("Station model position ", stationModel.position);

  const worldPosition = new THREE.Vector3();
  stationModel.getWorldPosition(worldPosition);

  console.log("Station model clicked! World position:", worldPosition);

  if (intersects.length > 0) {
    gsap.to(camera.position, {
      x: worldPosition.x + 7,
      y: worldPosition.y,
      z: worldPosition.z + 1,
      duration: 2,
      ease: "power2.inOut",
      // onComplete: () => {
      //   // Open a new web page after the animation completes
      //   window.location.href = "test.html"; // Replace with your desired URL
      // },
    });
  }
}

// Add click event listener
window.addEventListener('click', onMouseClick, false);

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

animate();
