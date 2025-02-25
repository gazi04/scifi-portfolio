import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from 'gsap';
import AlienStation from '../objects/AlienStation';
import OrangeRock from '../objects/OrangeRock';

class Jupiter {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.originalCameraPosition = this.camera.position.clone();
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

        // ADD ROCKS MODEL TO PLANET
        // const rock1 = new OrangeRock();
        // const rock2 = new OrangeRock();
        // const rock3 = new OrangeRock();
        // rock1.addRockToPlanet(this.planetGroup, 1, 1.98843298234, 0.5686757584);
        // rock2.addRockToPlanet(this.planetGroup, 2, 1.133958498, 4.392349809);
        // rock3.addRockToPlanet(this.planetGroup, 3, 1.32324998, 3.88852834);
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

  addRocks() {
    const numberOfRock = 10;
    const radius = 10;
    const rockModels = [1, 2, 3];

    for (let i = 0; i < numberOfRock; i++) {
      const angle = Math.floor(Math.random() * 360);
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = THREE.MathUtils.randFloatSpread(1);

      const modelNumber = rockModels[Math.floor(Math.random() * rockModels.length)];
      const rock = new OrangeRock(modelNumber).getModel();

      rock.position.set(x, y, 0.5);
      rock.scale.set(0.5, 0.5, 0.5);
      this.planetGroup.add(rock);
    }
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

  changePosition(x, y, z) { this.planetGroup.position.set(x, y, z); }
  changePositionX(x) { this.planetGroup.position.x = x; }
  changePositionY(y) { this.planetGroup.position.y = y; }
  changePositionZ(z) { this.planetGroup.position.z = z; }

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
      this.#setCameraToOriginalPosition();
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

  animaterOrbit(radius) {
    const duration = 20;
    const angleIncrement = (2 * Math.PI) / 360;

    let angle = 0;

    gsap.to({}, {
      duration: duration,
      repeat: -1,
      ease: "none",
      onUpdate: () => {
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);

        this.getModel().position.set(x, 0, z);

        angle += angleIncrement;
      },
    });
  }

  getModel() { return this.planetGroup; }

  #setCameraToOriginalPosition() {
    gsap.to(this.camera.position, {
      x: this.originalCameraPosition.x,
      y: this.originalCameraPosition.y,
      z: this.originalCameraPosition.z,
      duration: 2,
      ease: "power2.inOut",
    });
  }
}

export default Jupiter;
