import * as THREE from "three";
import { Application } from "./Application.js";
import { ApplicationWorld } from "./ApplicationWorld.js";
import { ApplicationSky } from "../objects/ApplicationSky.js";
import { ApplicationAmbientLight } from "../objects/ApplicationAmbientLight.js";
import { ApplicationPlane } from "../objects/ApplicationPlane.js";
import { ApplicationPlayer } from "../objects/ApplicationPlayer.js";
import { FBXLoader } from "FBXLoader";
import { ApplicationMazeGenerator } from "../objects/ApplicationMazeGenerator.js";
import { ApplicationMaze } from "../objects/ApplicationMaze.js";

const locker = document.getElementById("locker");
const world = new ApplicationWorld(0, -9.82, 0);
const app = new Application(world);
const loader = new FBXLoader();
const ambientLight = new ApplicationAmbientLight(0xffffff, 0.2);
const floor = new ApplicationPlane(10000, 10000);
const roof = new ApplicationPlane(10000, 10000);
const sky = new ApplicationSky();
const player = new ApplicationPlayer(app);
const maze = new ApplicationMazeGenerator(6, 6);
const appMaze = new ApplicationMaze(maze);
const startingPos = appMaze.getPos("entrance");
const exitPos = appMaze.getPos("exit");
const keyPos = maze.getKeyLocation();

loader.load("../assets/Door1.fbx", (door) => {
  door.position.set(startingPos[0] + 16, 0, startingPos[1] - 16);
  door.scale.set(0.4, 0.4, 0.4);
  door.rotation.y = -Math.PI / 2;

  const rMapp = new THREE.TextureLoader().load(
    "../assets/MetalPlates013_1K_Color.jpg"
  );

  door.name = "Entrance";

  door.children[0].material = new THREE.MeshPhysicalMaterial({
    clearcoat: 1.0,
    metalness: 0.9,
    roughness: 0.5,
    map: rMapp,
  });

  door.update = function () {};
  door.getMesh = function () {
    return door;
  };

  app.add(door);
});

loader.load("../assets/Door1.fbx", (door) => {
  door.position.set(exitPos[0] + 16, 0, exitPos[1] - 16);
  door.scale.set(0.4, 0.4, 0.4);
  door.rotation.y = -Math.PI / 2;

  const rMapp = new THREE.TextureLoader().load(
    "../assets/MetalPlates013_1K_Color.jpg"
  );

  door.name = "Exit";

  door.children[0].material = new THREE.MeshPhysicalMaterial({
    clearcoat: 1.0,
    metalness: 0.9,
    roughness: 0.5,
    map: rMapp,
  });

  door.update = function () {};
  door.getMesh = function () {
    return door;
  };

  app.add(door);
});

loader.load("../assets/key.fbx", (key) => {
  key.position.set(keyPos[0] * 32, 18, keyPos[1] * 32);
  key.rotation.x = -Math.PI / 2;

  key.children.forEach((mesh) => {
    mesh.material.color = new THREE.Color("#000000");
  });

  key.update = function () {
    key.rotation.z -= 0.01;
  };

  key.getMesh = function () {
    return key;
  };

  app.add(key);
});

app.getCamera().position.set(startingPos[0], 0, startingPos[1]);
appMaze.setLightPads();
appMaze.setPosition(0, 32 / 2, 0);
roof.setPosition(0, 32 * 3, 0);

app.add(ambientLight);
app.add(sky);
app.add(floor);
app.add(roof);
app.add(player);
app.add(appMaze);

locker.addEventListener("click", () => {
  player.getControls().lock();
  locker.style.display = "none";
});

//TODO : TIMER
