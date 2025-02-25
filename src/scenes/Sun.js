import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class Sun { 
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.originalCameraPosition = this.camera.position.clone();
    this.model = new THREE.Group;

    this.display();
  }

  #load() {
    const loader = new GLTFLoader();

    loader.load(
      "assets/models/Sun.glb",
      (gltf) => {
        const sun = gltf.scene;
        this.model.add(sun);
      },
      (xhr) => {
        console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`);
      },
      (error) => {
        console.error("Error loading GLB:", error);
      }
    );
  }

  display() {
    this.#load();
    this.model.position.set(0, 0, 0);
    this.model.scale.set(8, 8, 8);
    this.scene.add(this.model);
  }

  getModel() { return this.model; }
}

export default Sun;
