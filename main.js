import * as THREE from 'three';
import { TextureLoader } from 'three';

const scene = new THREE.Scene();
const texture = new THREE.TextureLoader().load('assets/milkyWay.jpg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
//texture.repeat.set( 4, 4 );

scene.background = texture;
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const alienColorMap = new TextureLoader().load('assets/metalAlien/Metal_Alien_001_COLOR.jpg');
const alienNormalMap = new TextureLoader().load('assets/metalAlien/Metal_Alien_001_NRM.jpg');
const alienDisplacementMap = new TextureLoader().load('assets/metalAlien/Metal_Alien_001_DISP.png');
const alienAoMap = new TextureLoader().load('assets/metalAlien/AO.jpg');
const alienSpecularMap = new TextureLoader().load('assets/metalAlien/Metal_Alien_001_SPEC.jpg');

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry(3,32,16); 
const material = new THREE.MeshStandardMaterial({
  map: alienColorMap,
  normalMap: alienNormalMap,
  displacementMap: alienDisplacementMap,
  displacementScale: 0.1,
  aoMap: alienAoMap,
  metalnessMap: alienSpecularMap,
  metalness: 0.8,
  roughness: 0.4 
});
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );

const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft global light
scene.add(ambientLight);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  //sphere.rotation.y += 0.0001; // Rotate the sphere
  window.addEventListener(
  "keydown",
    (event) => {
      if (event.defaultPrevented) {
        return; // Do nothing if event already handled
      }

      switch (event.code) {
        case "KeyS":
        case "ArrowDown":
          // Handle "back"
          sphere.rotation.x -= 0.0001;
          break;
        case "KeyW":
        case "ArrowUp":
          // Handle "forward"
          sphere.rotation.x += 0.0001;
          break;
        case "KeyA":
        case "ArrowLeft":
          // Handle "turn left"
          sphere.rotation.y -= 0.0001;
          break;
        case "KeyD":
        case "ArrowRight":
          // Handle "turn right"
          sphere.rotation.y -= 0.0001;
          break;
      }

      refresh();

      if (event.code !== "Tab") {
        // Consume the event so it doesn't get handled twice,
        // as long as the user isn't trying to move focus away
        event.preventDefault();
      }
    },
    true,
);

renderer.render(scene, camera);
}
