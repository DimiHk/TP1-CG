import * as THREE from "three";
export class DirectionaLightHelper {
  constructor(lightMesh) {
    this.helper = new THREE.DirectionalLightHelper(lightMesh.getMesh(), 100);
  }

  getMesh() {
    return this.helper;
  }

  update() {}
}
