import * as THREE from "three";
import { PointerLockControls } from "PointerLockControls";

const itemName = document.getElementById("itemName");

export class ApplicationPlayer {
  constructor(app) {
    this.playerControls = {
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
      canJump: true,
    };
    this.app = app;
    this.mesh = new THREE.PointLight("#ffffff", 0.3, 100);
    this.prevTime = performance.now();
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.controls = new PointerLockControls(app.getCamera(), app.getBody());
    this.ray = new THREE.Raycaster(
      new THREE.Vector3(),
      new THREE.Vector3(0, -1, 0),
      0,
      60
    );
    this.initialize();
  }

  initialize() {
    document.addEventListener("keyup", (keyboardKey) => {
      switch (keyboardKey.key) {
        case "w":
          this.playerControls.moveForward = false;
          break;

        case "a":
          this.playerControls.moveLeft = false;
          break;

        case "s":
          this.playerControls.moveBackward = false;
          break;

        case "d":
          this.playerControls.moveRight = false;
          break;
      }
    });
    document.addEventListener("keydown", (keyboardKey) => {
      switch (keyboardKey.key) {
        case "w":
          this.playerControls.moveForward = true;
          break;

        case "a":
          this.playerControls.moveLeft = true;
          break;

        case "s":
          this.playerControls.moveBackward = true;
          break;

        case "d":
          this.playerControls.moveRight = true;
          break;

        case " ":
          if (this.playerControls.canJump === true) this.velocity.y += 250;
          this.playerControls.canJump = false;
          break;
      }
    });
  }

  getMesh() {
    return this.mesh;
  }

  getControls() {
    return this.controls;
  }

  getRayCaster() {
    return this.ray;
  }

  update() {
    const time = performance.now();
    const delta = (time - this.prevTime) / 1000;

    if (this.controls.isLocked === true) {
      this.mesh.position.copy(this.controls.getObject().position);
      this.controls
        .getObject()
        .position.copy(this.controls.getObject().position);
      this.ray.ray.origin.copy(this.controls.getObject().position);
      this.ray.ray.origin.y -= 10;
      this.ray.ray.direction = this.app
        .getCamera()
        .getWorldDirection(new THREE.Vector3());

      this.velocity.x -= this.velocity.x * 2 * delta;
      this.velocity.z -= this.velocity.z * 2 * delta;
      this.velocity.y -= 9.8 * 100.0 * delta;

      this.ray.setFromCamera(new THREE.Vector2(0, 0), this.app.getCamera());
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

      this.direction.z =
        Number(this.playerControls.moveForward) -
        Number(this.playerControls.moveBackward);

      this.direction.x =
        Number(this.playerControls.moveRight) -
        Number(this.playerControls.moveLeft);

      this.direction.normalize();

      if (this.playerControls.moveForward || this.playerControls.moveBackward)
        this.velocity.z -= this.direction.z * 100.0 * delta;
      if (this.playerControls.moveLeft || this.playerControls.moveRight)
        this.velocity.x -= this.direction.x * 100.0 * delta;

      this.controls.moveRight(-this.velocity.x * delta);
      this.controls.moveForward(-this.velocity.z * delta);
      this.controls.getObject().position.y += this.velocity.y * delta;

      if (this.controls.getObject().position.y < 10) {
        this.velocity.y = 0;
        this.controls.getObject().position.y = 10;
        this.playerControls.canJump = true;
      }
    }
    this.prevTime = time;
  }
}
