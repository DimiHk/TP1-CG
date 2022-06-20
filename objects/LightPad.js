import * as THREE from "three";

export class LightPad {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = "lightPad";
    this.loader = new THREE.TextureLoader();
    this.initBase();
    this.initBall();
    this.light = new THREE.PointLight("#FFFFFF", 1, 50, 1);
    this.init();
  }

  initBase() {
    const texture = this.loader.load(
      "../assets/MetalPlates008_1K_NormalDX.jpg"
    );
    const texture2 = this.loader.load(
      "../assets/MetalPlates008_1K_Metalness.jpg"
    );
    const texture3 = this.loader.load("../assets/MetalPlates008_1K_Color.jpg");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 16;
    texture.repeat.set(2, 2);
    texture3.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture3.anisotropy = 16;
    texture3.repeat.set(2, 2);

    const geometry = new THREE.ConeGeometry(8, 12, 3);
    const material = new THREE.MeshPhysicalMaterial({
      metalness: 1,
      roughness: 0.5,
      metalnessMap: texture2,
      normalMap: texture,
      map: texture3,
    });
    this.baseMesh = new THREE.Mesh(geometry, material);
  }

  initBall() {
    const geometry = new THREE.SphereGeometry(6, 32, 16);
    const material = new THREE.MeshPhysicalMaterial({
      emissive: "#FFFFFF",
      emissiveIntensity: 1,
    });
    this.ballMesh = new THREE.Mesh(geometry, material);
  }

  init() {
    this.ballMesh.position.setY(13);
    this.light.position.setY(13);
    this.group.add(this.light);
    this.group.add(this.baseMesh);
    this.group.add(this.ballMesh);
  }

  getMesh() {
    return this.group;
  }

  setPosition(x, y, z) {
    this.group.position.set(x, y, z);
  }

  update() {}
}
