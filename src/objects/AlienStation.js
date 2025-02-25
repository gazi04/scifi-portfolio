import * as THREE from 'three';

class AlienStation {
  constructor(scene) {
    this.scene = scene;
    this.stationGroup = new THREE.Group();
    this.createAndDisplayModel();
  }

  createAndDisplayModel() {
    // Main Body
    const bodyGeometry = new THREE.TorusGeometry(5, 1.2, 8, 14);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x4444ff,
      metalness: 0.8, 
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = Math.PI / 2;
    this.stationGroup.add(body);

    // Dome
    const domeGeometry = new THREE.SphereGeometry(3, 10, 10);
    const domeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffcc00,
      transparent: true,
      opacity: 0.5,
      transmission: 1,
      emissive: 0xff8800,
      emissiveIntensity: 0.3
    });
    const dome = new THREE.Mesh(domeGeometry, domeMaterial);
    dome.position.y = 2;
    this.stationGroup.add(dome);

    // Antenna
    const antennaGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    const antennaMaterial = new THREE.MeshStandardMaterial({
      color: 0x00fefc,
      metalness: 1,  
      roughness: 0.05
    });
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.y = 5;
    this.stationGroup.add(antenna);

    // Torus Knot on Antenna
    const knotGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
    const knotMaterial = new THREE.MeshStandardMaterial({
      color: 0x00fefc,
      emissive: 0x00fefc,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.3
    });
    const knot = new THREE.Mesh(knotGeometry, knotMaterial);
    knot.position.y = 7.5;
    this.stationGroup.add(knot);
    this.scene.add(this.stationGroup)
  }

  getModel() {
    return this.stationGroup;
  }
}

export default AlienStation;
