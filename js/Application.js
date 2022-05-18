import * as THREE from "three";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const PIXELRATIO = window.devicePixelRatio;

export class Application {
  constructor(world) {
    this.world = world.getWorld();
    this.objects = [];
    this.createScene();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(120, WIDTH / HEIGHT, 1, 500);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.camera.position.set(0, 100, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;

    this.renderer.setPixelRatio(PIXELRATIO);
    this.renderer.setSize(WIDTH, HEIGHT);

    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    document.body.appendChild(this.renderer.domElement);

    this.render();
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    this.world.fixedStep();

    this.objects.forEach((object) => {
      if (object.type === "Group" && object.body) {
        object.position.copy(object.body.position);
        object.quaternion.copy(object.body.quaternion);
      }
      if (object.type === "Object3D" && object.mesh.body) {
        object.mesh.position.copy(object.mesh.body.position);
        object.mesh.quaternion.copy(object.mesh.body.quaternion);
      }

      object.update();
    });

    this.resizeRendererToDisplaySize();

    this.renderer.render(this.scene, this.camera);
  }

  add(mesh) {
    if (Array.isArray(mesh)) {
      for (var index in mesh) {
        this.objects.push(mesh[index]);
        this.scene.add(mesh[index].getMesh());
      }
    } else {
      this.objects.push(mesh);
      this.scene.add(mesh.getMesh());
    }
  }

  getCamera() {
    return this.camera;
  }

  getBody() {
    return document.body;
  }

  getScene() {
    return this.scene;
  }

  resizeRendererToDisplaySize() {
    const canvas = this.renderer.domElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
  }
}
