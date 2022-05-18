import * as THREE from "three";
import { ApplicationLightPad } from "./ApplicationLightPad.js";

export class ApplicationMaze {
  constructor(generatedMaze) {
    this.generatedMaze = generatedMaze;
    this.maze = new THREE.Group();
    this.init();
  }

  init() {
    const geometry = new THREE.BoxGeometry(32, 32, 32);
    const texture = new THREE.TextureLoader().load(
      "../assets/Tiles083_1K_Color.jpg"
    );
    const texture2 = new THREE.TextureLoader().load(
      "../assets/Tiles084_1K_Color.jpg"
    );

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 16;

    texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
    texture2.anisotropy = 16;

    for (let z = 0; z < 3; z++) {
      for (let i = 0; i < this.generatedMaze.cols; i++) {
        for (let j = 0; j < this.generatedMaze.rows; j++) {
          const random = Math.random() >= 0.5 ? 1 : 0;
          if (this.generatedMaze.maze[i][j] == "wall") {
            const material = new THREE.MeshPhysicalMaterial({
              metalness: 0.9,
              roughness: 0.8,
              map: random == 0 ? texture : texture2,
            });
            const cube = new THREE.Mesh(geometry, material);
            cube.name = "cube" + i + "/" + z + "/" + j;
            cube.position.set(i * 32, z * 32, j * 32);
            this.maze.add(cube);
          }
        }
      }
    }
  }

  getMesh() {
    return this.maze;
  }

  getPos(entranceName) {
    for (let i = 0; i < this.generatedMaze.cols; i++) {
      for (let j = 0; j < this.generatedMaze.rows; j++) {
        const objects = this.generatedMaze.maze[i][j];
        if (objects.length == 2 && objects[1] == entranceName) {
          return [i * 32, j * 32];
        }
      }
    }
  }

  setPosition(x, y, z) {
    this.maze.position.set(x, y, z);
  }

  setLightPads() {
    for (let i = 0; i < this.generatedMaze.cols; i++) {
      for (let j = 0; j < this.generatedMaze.rows; j++) {
        if (this.generatedMaze.maze[i][j] == "") {
          const lightPad = new ApplicationLightPad();
          const random = Number(Math.random() * 100 < 10);
          lightPad.setPosition(i * 32, -12, j * 32);
          random == 1 ? this.maze.add(lightPad.getMesh()) : null;
        }
      }
    }
  }

  update() {}
}
