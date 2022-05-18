import * as THREE from "three";

export class ApplicationDirectionalLight extends THREE.Light {
  constructor(color, intensity, config) {
    super(color, intensity);
    this.light = new THREE.DirectionalLight(color, intensity);
    this.setLightConfiguration(config);
  }

  setLightConfiguration(config) {
    this.light.castShadow = config.castShadow ? config.castShadow : true;
    this.light.shadow.mapSize.width = config.width ? config.width : 2048;
    this.light.shadow.mapSize.height = config.height ? config.height : 2048;
    this.light.shadow.camera.near = config.near ? config.near : 1;
    this.light.shadow.camera.far = config.far ? config.far : 6500;
    this.light.shadow.camera.fov = config.fov ? config.fov : 180;
    this.light.shadow.bias = config.bias ? config.bias : -0.001;
    this.light.shadow.camera.top = config.top ? config.top : 100;
    this.light.shadow.camera.bottom = config.bottom ? config.bottom : -100;
    this.light.shadow.camera.left = config.left ? config.left : 100;
    this.light.shadow.camera.right = config.right ? config.right : -100;
  }

  setLightPosition(x, y, z) {
    this.light.position.set(x, y, z);
  }

  getMesh() {
    return this.light;
  }

  update() {
    //Rotates the light
    //this.light.position.x = 1000 * Math.sin(Date.now() / 240);
    //this.light.position.z = 1000 * Math.cos(Date.now() / 240);
  }
}
