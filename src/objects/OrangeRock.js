import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class OrangeRock {
  constructor() {
    this.object = new THREE.Object3D();
  }

  // THE MODEL PARAMETER TELL WHICH ORANGE BLOCK MODEL TO LOAD FROM THE ASSETS/MODELS AND TAKES PARAMETERS FROM 1-3 INT NUMBER
  load(modelNumber) {
    let modelUrl;
    let choice = modelNumber % 3 + 1;

    switch (choice) {
      case 1:
        modelUrl = "assets/models/orangeRock.glb";
        break;
      case 2:
        modelUrl = "assets/models/orangeRock1.glb";
        break;
      case 3:
        modelUrl = "assets/models/orangeRock2.glb";
        break;
      default:
        return console.log('The model number parameter should be an integener between 1 to 3');
    }

    const modelLoader = new GLTFLoader();

    modelLoader.load(
      modelUrl,
      (gltf) => {
        let rock = gltf.scene;
        this.object.add(rock);
      },
      (xhr) => {
        console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`);
      },
      (error) => {
        console.error("Error loading GLB:", error);
      }
    );
  }

  addRockToPlanet(planet, rockModel, theta, phi) {
    const radius = 9.5;
    // const theta = 1.98843298234;
    // const phi = 0.5686757584;

    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(theta);

    this.load(rockModel);
    const rock = this.getModel();
    rock.rotateZ(-1.2);
    rock.position.set(x, y, z);
    rock.scale.set(0.4, 0.4, 0.4);
    planet.add(rock);

    // this.load(2)
    // const rock2 = this.getModel();
    // rock2.rotateZ(-1.2);
    //
    // theta = 2.133958498;
    // phi = 4.392349809;
    //
    // x = radius * Math.sin(theta) * Math.cos(phi);
    // y = radius * Math.sin(theta) * Math.sin(phi);
    // z = radius * Math.cos(theta);
    //
    // rock2.position.set(x, y, z);
    // rock2.scale.set(0.4, 0.4, 0.4);
    // planet.add(rock1);
    //
    // this.load(3);
    // const rock3 = this.getModel();
    // rock3.rotateZ(-1.2);
    //
    // theta = 1.32324998;
    // phi = 3.88852834;
    //
    // x = radius * Math.sin(theta) * Math.cos(phi);
    // y = radius * Math.sin(theta) * Math.sin(phi);
    // z = radius * Math.cos(theta);
    //
    // rock3.position.set(x, y, z);
    // rock3.scale.set(0.4, 0.4, 0.4);
    // planet.add(rock3);
  }

  changePosition(theta, phi) {
    const radius = 9.5;

    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(theta);

    this.getModel().position.set(x, y, z);
  }

  getModel() { return this.object; }
}

export default OrangeRock;
