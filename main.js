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

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(3, 32, 16);
const material = new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load('assets/scifi.jpg')});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  new THREE.MeshStandardMaterial({color: 0xff0000})
);

cube.position.set(3*Math.cos(0), 3*Math.sin(0), 0.5);
sphere.add(cube);

sphere.rotateY(175);

const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Listen for mouse clicks
window.addEventListener("click", (event) => {
  // Convert mouse position to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Set up the raycaster
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections
  const intersects = raycaster.intersectObject(cube); // Change `cube` to any object you want

  if (intersects.length > 0) {
    intersects[0].object.material.color.set(0xffff00);
  }

  // const clickableObjects = [cube, marker1, marker2]; // Add all objects you want to be clickable
  // const intersects = raycaster.intersectObjects(clickableObjects);
  //
  // if (intersects.length > 0) {
  //   console.log("Clicked on:", intersects[0].object.name);
  // }
});


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

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Mouse Down Event (Start Dragging)
document.addEventListener("mousedown", (event) => {
  isDragging = true;
  previousMousePosition = { x: event.clientX, y: event.clientY };
});

// Mouse Move Event (Dragging)
document.addEventListener("mousemove", (event) => {
  if (!isDragging) return;

  // Calculate mouse movement
  let deltaX = event.clientX - previousMousePosition.x;
  let deltaY = event.clientY - previousMousePosition.y;

  // Adjust rotation sensitivity
  let rotationSpeed = 0.005; 

  // Apply rotation to the sphere
  gsap.to(sphere.rotation, {
    y: sphere.rotation.y + deltaX * rotationSpeed, // Rotate around Y-axis
    x: sphere.rotation.x + deltaY * rotationSpeed, // Rotate around X-axis
    duration: 0.2, 
    ease: "power1.out",
  });

  // Update previous mouse position
  previousMousePosition = { x: event.clientX, y: event.clientY };
});

// Mouse Up Event (Stop Dragging)
document.addEventListener("mouseup", () => {
  isDragging = false;
});

// Prevent unwanted text selection while dragging
document.addEventListener("mouseleave", () => {
  isDragging = false;
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
