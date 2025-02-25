import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import Jupiter from './scenes/Jupiter';
import Sun from './scenes/Sun';

class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(82, 75, 78);
    // this.camera.position.x = 20;
    // this.camera.position.y = 5;
    // this.camera.position.z = 10;
    this.renderer = new THREE.WebGLRenderer();

    this.setupRenderer();
    this.setupLights();
    this.setupControls();
    this.setupCssRender();
    this.setupSpace();
    this.addPlanets();
    this.setupEventListeners();
    this.animate();
  }

  setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    const lightHelper = new THREE.PointLightHelper(directionalLight);
    const gridHelper = new THREE.GridHelper(400, 100);
    this.scene.add(lightHelper, gridHelper);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  setupCssRender() {
    this.css3DRenderer = new CSS3DRenderer();
    this.css3DRenderer.setSize(window.innerWidth, window.innerHeight);
    this.css3DRenderer.domElement.style.position = 'absolute';
    this.css3DRenderer.domElement.style.top = '0';
    this.css3DRenderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(this.css3DRenderer.domElement);
  }

  setupSpace() {
    const texture = new THREE.TextureLoader().load('assets/milkyWay.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.scene.background = texture;
    [...Array(800)].forEach(() => this.addStar());
  }

  addPlanets() {
    const radius = 40;

    this.jupiter = new Jupiter(this.scene, this.camera);
    this.jupiter.changePositionX(radius);
    this.sun = new Sun(this.scene, this.camera);
    this.jupiter.animaterOrbit(radius);
  }

  addStar() {
    const star = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(400));
    star.position.set(x, y, z);
    this.scene.add(star);
  }

  setupEventListeners() {
    // TODO- THE EVENT SHOULD CHANGE BASED ON WHICH PLANET IS FOCUSED 
    document.addEventListener("keydown", (event) => {
      if (this.jupiter) {
        this.jupiter.spin(event);
      }
    });

    document.addEventListener("click", (event) => {
      this.jupiter.clickStationEvent(event, this.controls);
    }, false);
  }

  animate() {
    this.sun.getModel().rotation.y += 0.007;
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.css3DRenderer.render(this.scene, this.camera);
  }
}

export default SceneManager;
