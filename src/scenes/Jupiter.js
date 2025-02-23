import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from 'gsap';
import { AlienStation } from '../objects/AlienStation';

class Jupiter {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.planetGroup = new THREE.Group();
    this.isHologramMode = false;
    this.hologramOverlay = document.getElementById('hologram-overlay');
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
    if (this.isHologramMode) return;

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
    const hologramContent = document.getElementById('hologram-content');
    hologramContent.innerHTML = await this.loadHologramContent();

    const closeButton = document.createElement('button');
    closeButton.id = 'close-button';
    closeButton.innerText = 'Close';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.backgroundColor = 'cyan';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
      this.hologramOverlay.style.display = 'none';
      this.isHologramMode = false;
      this.controls.enabled = true;
      console.log('Hologram closed');
    };

    hologramContent.appendChild(closeButton);

    this.hologramOverlay.style.display = 'flex';
  }

  clickStationEvent(event, controls) {
    if (this.isHologramMode) return;

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
      this.controls = controls;
      this.isHologramMode = true;

      gsap.to(this.camera.position, {
        x: worldPosition.x + 7,
        y: worldPosition.y,
        z: worldPosition.z + 1,
        duration: 2,
        ease: "power2.inOut",
        onComplete: async () => {
          await this.createHologram();
        },
      });
    }
  }

  getModel() {
    return this.planetGroup;
  }
}

export default Jupiter;
