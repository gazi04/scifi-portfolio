import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Set background to black
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry(1,32,16); 
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } ); 
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );
camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.01; // Rotate the sphere
  renderer.render(scene, camera);
}
