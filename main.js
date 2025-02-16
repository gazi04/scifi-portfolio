import * as THREE from 'three';
import { gsap } from 'gsap';
import { TextureLoader } from 'three';

const scene = new THREE.Scene();
const texture = new THREE.TextureLoader().load('assets/milkyWay.jpg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
scene.background = texture;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// const alienColorMap = new TextureLoader().load('assets/metalAlien/Metal_Alien_001_COLOR.jpg');
// const alienNormalMap = new TextureLoader().load('assets/metalAlien/Metal_Alien_001_NRM.jpg');
// const alienDisplacementMap = new TextureLoader().load('assets/metalAlien/Metal_Alien_001_DISP.png');
// const alienAoMap = new TextureLoader().load('assets/metalAlien/AO.jpg');
// const alienSpecularMap = new TextureLoader().load('assets/metalAlien/Metal_Alien_001_SPEC.jpg');

const alienColorMap = new TextureLoader().load('assets/fiberTexture/Stylized_Roof_001_basecolor.png');
const alienNormalMap = new TextureLoader().load('assets/fiberTexture/Stylized_Roof_001_normal.png');
const alienDisplacementMap = new TextureLoader().load('assets/fiberTexture/Stylized_Roof_001_height.png');
const alienAoMap = new TextureLoader().load('assets/fiberTexture/Stylized_Roof_001_ambientOcclusion.jpg');
const alienSpecularMap = new TextureLoader().load('assets/fiberTexture/Stylized_Roof_001_roughness.png');

const mat = new THREE.TextureLoader().load('assets/fiberTexture/Material_1904.png');

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(3, 32, 16);
const material = new THREE.MeshBasicMaterial({map:mat});
// const material = new THREE.MeshStandardMaterial({
//   map: alienColorMap,
//   normalMap: alienNormalMap,
//   displacementMap: alienDisplacementMap,
//   displacementScale: 0.1,
//   aoMap: alienAoMap,
//   metalnessMap: alienSpecularMap,
//   metalness: 0.8,
//   roughness: 0.4
// });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

document.addEventListener("keydown", (event) => {
  let rotationAmount = Math.PI / 8;

  switch (event.code) {
    case "KeyS":
    case "ArrowDown":
      gsap.to(sphere.rotation, { x: sphere.rotation.x - rotationAmount, duration: 0.5, ease: "power1.out" });
      break;
    case "KeyW":
    case "ArrowUp":
      gsap.to(sphere.rotation, { x: sphere.rotation.x + rotationAmount, duration: 0.5, ease: "power1.out" });
      break;
    case "KeyA":
    case "ArrowLeft":
      gsap.to(sphere.rotation, { y: sphere.rotation.y - rotationAmount, duration: 0.5, ease: "power1.out" });
      break;
    case "KeyD":
    case "ArrowRight":
      gsap.to(sphere.rotation, { y: sphere.rotation.y + rotationAmount, duration: 0.5, ease: "power1.out" });
      break;
  }
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
