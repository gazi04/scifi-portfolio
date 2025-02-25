import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class Sun { 
  constructor() {
    this.model = new THREE.Object3D;
  }

  load() {
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

  getModel() { return this.model; }
}

export default Sun;
