import * as THREE from "three";
import { Sky } from "Sky";

export class ApplicationSky {
  constructor(config) {
    this.sky = new Sky();
    this.sun = new THREE.Vector3();
    this.uniforms = this.sky.material.uniforms;
    this.setSkyConfiguration(config);
  }

  setSkyConfiguration(config) {
    const phi = THREE.MathUtils.degToRad(90 - 35);
    const theta = THREE.MathUtils.degToRad(180);

    if (config) {
      this.uniforms["turbidity"].value = config.turbidity;
      this.uniforms["rayleigh"].value = config.rayleigh;
      this.uniforms["mieCoefficient"].value = config.mieCoefficient;
      this.uniforms["mieDirectionalG"].value = config.mieDirectionalG;
    } else {
      this.uniforms["turbidity"].value = 0.0003;
      this.uniforms["rayleigh"].value = 0.0001;
      this.uniforms["mieCoefficient"].value = 0.1;
      this.uniforms["mieDirectionalG"].value = 0.966;
    }

    this.sun.setFromSphericalCoords(1, phi, theta);
    this.sky.scale.setScalar(100000, 100000);

    this.uniforms["sunPosition"].value.copy(this.sun);
  }

  getMesh() {
    return this.sky;
  }

  update() {}
}
