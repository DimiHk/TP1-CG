import * as THREE from "three";
import * as CANNON from "cannon";

export class ApplicationPlane {
  constructor(width, height) {
    this.initMeshConfig(width, height);
    this.body = this.initPhysics(0);
  }

  initPhysics(mass) {
    const shape = new CANNON.Plane();
    const body = new CANNON.Body({
      mass: mass,
      shape: shape,
    });
    body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.mesh.body = body;
    return body;
  }

  initMeshConfig(width, height) {
    this.geometry = new THREE.PlaneBufferGeometry(width, height, 1, 1);
    this.texture = new THREE.TextureLoader().load(
      "../assets/Tiles085_1K_Color.jpg"
    );
    this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.set(256, 256);
    this.texture.anisotropy = 16;
    this.material = new THREE.MeshPhysicalMaterial({
      /*  clearcoat: 1.0,
      clearcoatRoughness: 0.1, */
      metalness: 0.9,
      roughness: 0.5,
      side: THREE.DoubleSide,
      map: this.texture,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = "plane";
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  setPosition(x, y, z) {
    this.mesh.position.set(x, y, z);
  }

  getMesh() {
    return this.mesh;
  }

  getBody() {
    return this.body;
  }

  update() {}
}
