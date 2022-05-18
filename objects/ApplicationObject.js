import * as THREE from "three";

export class ApplicationObject extends THREE.Object3D {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  getWidth() {
    return this.width;
  }
  setWidth(width) {
    this.width = width;
  }
  getHeight() {
    return this.height;
  }
  setHeight(height) {
    this.height = height;
  }
}
