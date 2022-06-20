import * as THREE from "three";
import { Application } from "./Application.js";
import { ApplicationWorld } from "./ApplicationWorld.js";
import { Light } from "../objects/Light.js";
import { Player } from "../objects/Player.js";
import { Cube } from "../objects/Cube.js";
import { MazeGenerator } from "../objects/MazeGenerator.js";
import { LightPad } from "../objects/LightPad.js";
import { Plane } from "../objects/Plane.js";
import { FBXLoader } from "FBXLoader";
import { SkyBox } from "../objects/SkyBox.js";

const timerDiv = document.getElementById("timer");
const board = document.getElementById("finishBoard");
const gui = document.getElementById("item1");

const loader = new THREE.TextureLoader();
const fbxLoader = new FBXLoader();
const world = new ApplicationWorld(0, -20, 0);
const app = new Application(world);
const player = new Player(4, world.getWorld(), app.camera, app);
const playerLight = new THREE.PointLight("#FFFFFF", 0.3, 100);
const mazeGenerator = new MazeGenerator(4, 4);
const sky = new SkyBox();
const floor = new Plane(1000, 1000, 0, world.getWorld());
const light = new Light("#ffffff", 0.3);
const startingPos = mazeGenerator.getPos("entrance");
const exitPos = mazeGenerator.getPos("exit");
const keyPos = mazeGenerator.getKeyLocation();
const exitColider = new Cube(32, 32, 32, 0, 0, world.getWorld());
const PreExitColider = new Cube(32, 32, 32, 0, 0, world.getWorld(), true);
const startColider = new Cube(32, 32, 32, 0, 0, world.getWorld());
const keyColider = new Cube(8, 8, 8, 0, 0, world.getWorld(), true);
const textureMug = loader.load("../assets/Tiles083_1K_Color.jpg");
const textureTailed = loader.load("../assets/Tiles084_1K_Color.jpg");

let isPicked = false;
let timer = { hours: 0, minutes: 0, seconds: 0 };
let lastTimer = window.localStorage.getItem("timer");

const interval = setInterval(() => {
  if (player.controls.enabled == true) {
    timer.seconds += 1;
    if (timer.seconds == 60) {
      timer.minutes += 1;
      timer.seconds = 0;
    }
    if (timer.minutes == 60) {
      timer.hours += 1;
      timer.minutes = 0;
    }
    timerDiv.innerHTML =
      timer.hours + ":" + timer.minutes + ":" + timer.seconds;
  }
}, 1000);

//Texture Configuration
textureMug.wrapS = textureMug.wrapT = THREE.RepeatWrapping;
textureMug.anisotropy = 16;
textureTailed.wrapS = textureTailed.wrapT = THREE.RepeatWrapping;
textureTailed.anisotropy = 16;

//Maze setup
for (let z = 0; z < 3; z++) {
  for (let i = 0; i < mazeGenerator.cols; i++) {
    for (let j = 0; j < mazeGenerator.rows; j++) {
      const random = Math.random() >= 0.5 ? 1 : 0;
      const randomPads = Number(Math.random() * 100 < 5);
      if (mazeGenerator.maze[i][j] == "wall") {
        const cube2 = new Cube(
          32,
          32,
          32,
          0,
          {
            metalness: 0.9,
            roughness: 0.8,
            map: random == 0 ? textureMug : textureTailed,
          },
          world.getWorld()
        );
        cube2.setPosition(i * 32, z * 32, j * 32);
        cube2.mesh.name = "cube" + i + "/" + z + "/" + j;
        app.add(cube2);
      }
      if (mazeGenerator.maze[i][j] == "") {
        const lightPad = new LightPad();
        lightPad.setPosition(i * 32, 0, j * 32);
        randomPads == 1 ? app.add(lightPad) : null;
      }
    }
  }
}

//Assests setup
fbxLoader.load("../assets/Door1.fbx", (door) => {
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

fbxLoader.load("../assets/Door1.fbx", (door) => {
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

fbxLoader.load("../assets/key.fbx", (key) => {
  key.position.set(keyPos[0] * 32, 18, keyPos[1] * 32);
  key.rotation.x = -Math.PI / 2;
  key.name = "key";

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

playerLight.getMesh = function () {
  return playerLight;
};

playerLight.update = function () {
  playerLight.position.copy(player.sphereBody.position);
};

startColider.setPosition(startingPos[0] + 32, 0, startingPos[1]);
exitColider.setPosition(exitPos[0], 0, exitPos[1]);
player.setPosition(startingPos[0], 0, startingPos[1]);
keyColider.setPosition(keyPos[0] * 32, 0, keyPos[1] * 32);
PreExitColider.setPosition(exitPos[0], 0, exitPos[1]);

//Scene triggers
keyColider.getBody().addEventListener("collide", (event) => {
  const imageAt = document.createElement("img");

  imageAt.src = "http://grupoint.pt/wp-content/uploads/2017/07/house-key.png";
  imageAt.className = "key";

  gui.appendChild(imageAt);

  app.scene.remove(app.scene.getObjectByName("key"));

  isPicked = true;
});

PreExitColider.getBody().addEventListener("collide", (event) => {
  if (isPicked) {
    lastTimer = JSON.parse(lastTimer);
    window.localStorage.setItem("timer", JSON.stringify(timer));

    gui.removeChild(gui.firstChild);
    player.controls.enabled = false;
    clearInterval(interval);

    document.getElementById("scoreboard_timer_last").innerHTML =
      "Last Time : " +
      lastTimer.hours +
      ":" +
      lastTimer.minutes +
      ":" +
      lastTimer.seconds;

    document.getElementById("scoreboard_timer").innerHTML =
      "Current Time : " +
      timer.hours +
      ":" +
      timer.minutes +
      ":" +
      timer.seconds;
    document.getElementById("in_game").style.display = "none";
    board.style.display = "block";
  }
});

app.add(light);
app.add(player);
app.add(playerLight);
app.add(floor);
app.add(sky);
