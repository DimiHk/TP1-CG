import * as THREE from "three";
import * as CANNON from "cannon";

export class Cube extends THREE.Object3D {
  constructor(width, height, depth, mass, material, world, isTrigger) {
    super();
    this.geometry = new THREE.BoxBufferGeometry(width, height, depth);
    this.material = new THREE.MeshPhysicalMaterial(material);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.initCannon(width, height, depth, mass, isTrigger, world);
  }

  initCannon(width, height, depth, mass, isTrigger, world) {
    this.shape = new CANNON.Box(
      new CANNON.Vec3(width / 2, height / 2, depth / 2)
    );
    this.shapeBody = new CANNON.Body({
      mass: mass,
      isTrigger: isTrigger,
    });
    this.shapeBody.addShape(this.shape);
    world.addBody(this.shapeBody);
  }

  setPosition(x, y, z) {
    this.shapeBody.position.set(x, y, z);
  }

  getBody() {
    return this.shapeBody;
  }

  getMesh() {
    return this.mesh;
  }

  update() {
    this.mesh.position.copy(this.shapeBody.position);
    this.mesh.quaternion.copy(this.shapeBody.quaternion);
  }
}
