import * as THREE from "three";

export class ApplicationAmbientLight extends THREE.Light {
  constructor(color, intensity) {
    super(color, intensity);
    this.light = new THREE.AmbientLight(color, intensity);
  }

  getMesh() {
    return this.light;
  }

  update() {}
}
