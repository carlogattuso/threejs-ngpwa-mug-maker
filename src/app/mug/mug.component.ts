import {AfterViewInit, Component, effect, ElementRef, inject, Input, Renderer2, ViewChild} from '@angular/core';
import {AppComponent} from "../app.component";
import {
  AmbientLight,
  CanvasTexture,
  DirectionalLight,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader.js";
import {ThreeUtils} from "../utils/three.utils";
import {ColorPickerChangeEvent} from "primeng/colorpicker";
import {MugModelPath, MugParts, SceneObjects} from "../app.constants";
import {MugPartKey} from "../app.types";

interface SceneConfig {
  ambientLightIntensity: number;
  directionalLightIntensity: number;
  directionalLightPosition: [number, number, number];
  camera: {
    fov: number;
    near: number;
    far: number;
    position: { z: number };
  };
  controls: {
    minDistance: number;
    maxDistance: number;
  };
}

@Component({
  selector: 'app-mug',
  standalone: true,
  imports: [],
  template: `
    <canvas #canvas class="h-screen w-full"></canvas>`
})
export class MugComponent implements AfterViewInit {
  @ViewChild('canvas', {static: true})
  private readonly canvas!: ElementRef<HTMLCanvasElement>;
  private canvasElement!: HTMLCanvasElement;

  @Input() isMugMoving = true;

  private readonly renderer2: Renderer2 = inject(Renderer2);
  private readonly scene = new Scene();
  private camera!: PerspectiveCamera;
  private webGLRenderer?: WebGLRenderer;
  private controls?: OrbitControls;
  private mugMaterialsMap: Map<keyof typeof MugParts, MeshPhysicalMaterial> = new Map();

  private readonly sceneConfig: SceneConfig = {
    ambientLightIntensity: 0.75,
    directionalLightIntensity: 2.75,
    directionalLightPosition: [10, 10, 5],
    camera: {
      fov: 30,
      near: 1,
      far: 2000,
      position: {z: 35}
    },
    controls: {
      minDistance: 1,
      maxDistance: 1000
    }
  };

  private readonly lights = {
    ambient: new AmbientLight(0xffffff, this.sceneConfig.ambientLightIntensity),
    directional: new DirectionalLight(0xffffff, this.sceneConfig.directionalLightIntensity)
  };

  constructor() {
    effect((): void => {
      if (AppComponent.isReady()) {
        this.camera = this.initCamera();
        this.initScene();
      }
    });
  }

  ngAfterViewInit(): void {
    this.canvasElement = this.renderer2.selectRootElement(this.canvas.nativeElement, true) as HTMLCanvasElement;
  }

  private initCamera(): PerspectiveCamera {
    const {fov, near, far, position} = this.sceneConfig.camera;
    const camera = new PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
    camera.position.z = position.z;
    return camera;
  }

  private async initScene(): Promise<void> {
    await this.setupLights();
    await this.setupRenderer();
    await this.setupControls();
    await this.loadMugModel();
    this.animate();
  }

  private async setupLights(): Promise<void> {
    const {directional} = this.lights;
    directional.color.setHSL(0.1, 1, 0.95);
    directional.position.set(-1, 1.75, 1);
    directional.position.multiplyScalar(30);
    this.camera.add(directional);

    this.scene.add(this.camera);
    this.scene.add(this.lights.ambient);
  }

  private async setupRenderer(): Promise<void> {
    this.webGLRenderer = new WebGLRenderer({
      canvas: this.canvasElement,
      antialias: true
    });

    this.webGLRenderer.setPixelRatio(window.devicePixelRatio);
    this.webGLRenderer.setClearColor(0xF9FAFB);
    this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    this.webGLRenderer.localClippingEnabled = true;
  }

  private async setupControls(): Promise<void> {
    if (!this.webGLRenderer) return;

    this.controls = new OrbitControls(this.camera, this.webGLRenderer.domElement);
    this.controls.minDistance = this.sceneConfig.controls.minDistance;
    this.controls.maxDistance = this.sceneConfig.controls.maxDistance;
    this.controls.enablePan = false;
  }

  private async loadMugModel(): Promise<void> {
    const mug: GLTF = await ThreeUtils.loadModel(MugModelPath);

    Object.keys(MugParts).forEach((key: string): void => {
      const partKey = key as MugPartKey;
      this.mugMaterialsMap.set(partKey, this.getMeshMaterial(mug, MugParts[partKey]));
    });

    this.scene.add(mug.scene);
  }

  private getMeshMaterial(gltf: GLTF, name: string): MeshPhysicalMaterial {
    const mesh = gltf.scene.getObjectByName(name) as Mesh | null;
    return mesh?.material as MeshPhysicalMaterial;
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    if (this.isMugMoving) {
      const mug = this.scene.getObjectByName(SceneObjects.MUG);
      if (mug) mug.rotation.y += 0.01;
    }

    this.render();
  }

  private render(): void {
    if (!this.webGLRenderer || !this.canvasElement) return;

    const {clientWidth, clientHeight} = this.canvasElement;
    this.onWindowResize(clientWidth, clientHeight);
    this.webGLRenderer.render(this.scene, this.camera);
  }

  private onWindowResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.webGLRenderer?.setSize(width, height);
  }

  public getMaterialByPart(part: MugPartKey): MeshPhysicalMaterial | undefined {
    return this.mugMaterialsMap.get(part);
  }

  public async setLogo(texture: string): Promise<void> {
    const logoMaterial = this.getMaterialByPart('LOGO');

    if (logoMaterial) {
      const textureMap: CanvasTexture = await ThreeUtils.loadTexture(texture);
      textureMap.flipY = false;
      logoMaterial.map = textureMap;
      logoMaterial.needsUpdate = true;
    }
  }

  public updateMaterial(part: MugPartKey, event: ColorPickerChangeEvent): void {
    const material = this.getMaterialByPart(part);

    if (material) {
      const colorRGB = parseInt(String(event.value).replace("#", "0x"), 16);
      material.color.setHex(colorRGB, SRGBColorSpace);
      material.needsUpdate = true;
    }
  }
}
