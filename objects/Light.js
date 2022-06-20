import * as THREE from "three";

export class Light {
  constructor(color, intensity) {
    this.light = new THREE.AmbientLight(color, intensity);
  }

  getMesh() {
    return this.light;
  }

  update() {}
}
