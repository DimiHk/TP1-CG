import * as THREE from "three";
import * as CANNON from "cannon";

export class Plane {
  constructor(width, height, mass, world) {
    this.iniTexture();
    this.geometry = new THREE.PlaneBufferGeometry(width, height);
    this.material = new THREE.MeshPhysicalMaterial({
      metalness: 0.9,
      roughness: 0.5,
      side: THREE.DoubleSide,
      map: this.texture,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = "plane";
    this.initCannon(width, height, mass, world);
  }

  iniTexture() {
    this.texture = new THREE.TextureLoader().load(
      "../assets/Tiles085_1K_Color.jpg"
    );
    this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.set(256, 256);
    this.texture.anisotropy = 16;
  }

  initCannon(width, height, mass, world) {
    this.shape = new CANNON.Plane(new CANNON.Vec3(width, height));
    this.body = new CANNON.Body({
      mass: mass,
    });
    this.body.addShape(this.shape);
    this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(this.body);
  }

  setPosition(x, y, z) {
    this.body.position.set(x, y, z);
  }

  getBody() {
    return this.body;
  }

  getMesh() {
    return this.mesh;
  }

  update() {
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
  }
}
