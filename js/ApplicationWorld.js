import * as CANNON from "cannon";

export class ApplicationWorld {
  constructor(gravityX, gravityY, gravityZ) {
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(gravityX, gravityY, gravityZ),
    });
    this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
    this.world.defaultContactMaterial.contactEquationRelaxation = 4;
  }

  getWorld() {
    return this.world;
  }
}
