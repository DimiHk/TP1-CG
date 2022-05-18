import * as THREE from "three";
import * as CANNON from "cannon";
import { ApplicationObject } from "./ApplicationObject.js";

export class ApplicationCube extends ApplicationObject {
  constructor(width, height, depth, mass, meshLambertParams) {
    super(width, height);
    this.createMesh(meshLambertParams, depth);
    this.createCannonColision(this.width, this.height, depth, mass);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  createMesh(meshLambertParams, depth) {
    this.geometry = new THREE.BoxBufferGeometry(this.width, this.height, depth);
    this.material = new THREE.MeshLambertMaterial(meshLambertParams);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  createCannonColision(width, height, depth, mass) {
    this.shape = new CANNON.Box(
      new CANNON.Vec3(width / 2, height / 2, depth / 2)
    );
    this.body = new CANNON.Body({
      mass: mass,
    });
    this.body.addShape(this.shape);
    this.mesh.body = this.body;
  }

  setPosition(x, y, z) {
    this.body.position.set(x, y, z);
  }

  getMesh() {
    return this.mesh;
  }

  getBody() {
    return this.body;
  }

  update() {}
}
