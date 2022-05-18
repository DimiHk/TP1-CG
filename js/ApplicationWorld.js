import * as CANNON from "cannon";

export class ApplicationWorld {
  constructor(gravityX, gravityY, gravityZ) {
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(gravityX, gravityY, gravityZ),
    });
  }

  addBody(body) {
    this.world.addBody(body.getBody());
  }

  getWorld() {
    return this.world;
  }
}
