import * as THREE from "three";
import * as CANNON from "cannon";
import { PointerLockControlsCannon } from "../cannon-es-master/examples/js/PointerLockControlsCannon.js";

const instructions = document.getElementById("locker");
const itemName = document.getElementById("itemName");

export class Player {
  constructor(radius, world, camera, app) {
    this.lastCallTime = performance.now();
    this.camera = camera;
    this.world = world;
    this.sphereShape = new CANNON.Sphere(radius);
    this.sphereBody = new CANNON.Body({ mass: 65 });
    this.sphereBody.addShape(this.sphereShape);
    this.sphereBody.linearDamping = 0.9;
    this.world.addBody(this.sphereBody);
    this.app = app;
    this.ray = new THREE.Raycaster(
      new THREE.Vector3(),
      new THREE.Vector3(0, -1, 0),
      0,
      60
    );

    this.controls = new PointerLockControlsCannon(this.camera, this.sphereBody);

    this.controls.velocityFactor = 0.5;

    instructions.addEventListener("click", () => {
      this.controls.lock();
    });

    this.controls.addEventListener("lock", () => {
      this.controls.enabled = true;
      instructions.style.display = "none";
    });

    this.controls.addEventListener("unlock", () => {
      this.controls.enabled = false;
      instructions.style.display = null;
    });
  }

  setPosition(x, y, z) {
    this.sphereBody.position.set(x, y, z);
  }

  getMesh() {
    return this.controls.getObject();
  }

  update() {
    const time = performance.now() / 1000;
    const dt = time - this.lastCallTime;
    this.lastCallTime = time;

    if (this.controls.enabled) {
      this.world.step(1 / 60, dt);

      this.ray.ray.origin.copy(this.controls.getObject().position);
      this.ray.ray.origin.y -= 10;
      this.ray.ray.direction = this.camera.getWorldDirection(
        new THREE.Vector3()
      );

      this.ray.setFromCamera(new THREE.Vector2(0, 0), this.camera);
      const intersects = this.ray.intersectObject(this.app.getScene(), true);

      if (intersects.length == 0) {
        itemName.style.display = "none";
      }

      if (intersects.length > 0) {
        let object = intersects[0].object;
        itemName.style.display = "";
        itemName.innerHTML = object.parent.name
          ? object.parent.name
          : object.name;
      }
    }

    this.controls.update(dt);
  }
}
