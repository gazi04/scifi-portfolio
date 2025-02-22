import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from 'gsap';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { AlienStation } from '../objects/AlienStation';

class Jupiter {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.planetGroup = new THREE.Group();
    this.createAndDisplayModel();
  }

  createAndDisplayModel() {
    const gltfLoader = new GLTFLoader();
    this.stationModel = new AlienStation(this.scene).getModel();

    gltfLoader.load(
      "assets/Jupiter.glb",
      (gltf) => {
        let planet = gltf.scene;

        planet.position.set(0, -10, 0);
        planet.scale.set(0.1, 0.1, 0.1);
        this.planetGroup.add(planet);

        this.stationModel.scale.set(0.3, 0.3, 0.3);
        this.stationModel.rotateZ(-1.5);
        this.stationModel.position.set(10 * Math.cos(0), 10 * Math.sin(0), 0.5);
        this.planetGroup.add(this.stationModel);

        console.log("GLB Model Loaded!", planet);
      },
      (xhr) => {
        console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`);
      },
      (error) => {
        console.error("Error loading GLB:", error);
      }
    );

    this.scene.add(this.planetGroup);
  }

  spin(event) {
    let rotationAmount = Math.PI / 8;

    switch (event.code) {
      case "KeyA":
      case "ArrowLeft":
        gsap.to(this.planetGroup.rotation, { y: this.planetGroup.rotation.y - rotationAmount, duration: 0.5, ease: "power1.out" });
        break;
      case "KeyD":
      case "ArrowRight":
        gsap.to(this.planetGroup.rotation, { y: this.planetGroup.rotation.y + rotationAmount, duration: 0.5, ease: "power1.out" });
        break;
    }
  }

  async loadHologramContent() {
    const response = await fetch('/assets/views/aboutMe.html');
    return await response.text();
  }

  async createHologram() {
    const hologramDiv = document.createElement('div');
    hologramDiv.id = 'hologram-content';
    hologramDiv.style.fontSmoothing = 'antialiased';
    hologramDiv.style.webkitFontSmoothing = 'antialiased';
    hologramDiv.style.backfaceVisibility = 'hidden';
    hologramDiv.style.transformStyle = 'preserve-3d';

    hologramDiv.innerHTML = await this.loadHologramContent();

    if (!document.querySelector("link[href='/assets/css/hologram.css']")) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/css/hologram.css';
      document.head.appendChild(link);
    }

    const hologramObject = new CSS3DObject(hologramDiv);
    hologramObject.scale.set(0.01, 0.01, 0.01);
    return hologramObject;
  }

  clickStationEvent(event, controls) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, this.camera);

    const intersects = raycaster.intersectObject(this.stationModel, true);

    if (intersects.length > 0) {
      const worldPosition = new THREE.Vector3();
      this.stationModel.getWorldPosition(worldPosition);

      controls.enabled = false;

      gsap.to(this.camera.position, {
        x: worldPosition.x + 7,
        y: worldPosition.y,
        z: worldPosition.z + 1,
        duration: 2,
        ease: "power2.inOut",
        onComplete: async () => {
          const hologram = await this.createHologram();

          const distanceFromCamera = 3;
          const hologramPosition = new THREE.Vector3();
          this.camera.getWorldDirection(hologramPosition);
          hologramPosition.multiplyScalar(distanceFromCamera).add(this.camera.position);
          hologram.position.copy(hologramPosition);

          hologram.lookAt(this.camera.position);

          this.scene.add(hologram);

          controls.enabled = true;
        },
      });
    }
  }

  getModel() {
    return this.planetGroup;
  }
}

export default Jupiter;
