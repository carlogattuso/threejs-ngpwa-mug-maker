import {AfterViewInit, Component, effect, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {
  AmbientLight,
  CanvasTexture,
  DirectionalLight,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {findMeshMaterial, loadModel, loadTexture} from "../../utils/three.utils";
import {MugModelPath, MugParts, SceneObjects} from "../../app.constants";
import {SceneConfigService} from "../../services/scene-config.service";
import {CanvasDimensions, ColorChangeEvent, MugPartKey} from "../../app.types";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader.js";
import {readFileAsString} from "../../utils/file.utils";
import {ThemeService} from "../../services/theme.service";

@Component({
  selector: 'app-mug',
  standalone: true,
  imports: [],
  template: `
    <canvas #canvas class="!h-full !w-full"></canvas>
  `
})
export class MugComponent implements AfterViewInit {
  @Input() isMugRotating = true;

  @ViewChild('canvas') private readonly canvas!: ElementRef<HTMLCanvasElement>;
  private readonly themeService = inject(ThemeService);
  private readonly sceneConfigService = inject(SceneConfigService).sceneConfig;
  private readonly mugMaterialsMap: Map<keyof typeof MugParts, MeshPhysicalMaterial> = new Map();

  private scene = new Scene();
  private camera = new PerspectiveCamera();
  private renderer = new WebGLRenderer();

  constructor() {
    this.initRendererColor();
  }

  async ngAfterViewInit(): Promise<void> {
    const {width, height} = this.getCanvasDimensions();

    this.initCamera(width, height);
    this.initRenderer(width, height);
    this.initOrbitControls();

    const directionalLight: DirectionalLight = this.initDirectionalLight();
    const ambientLight: AmbientLight = new AmbientLight(this.sceneConfigService.lights.color, this.sceneConfigService.lights.ambient.intensity);

    this.camera.add(directionalLight);
    this.scene.add(this.camera);
    this.scene.add(ambientLight);

    const mug: GLTF = await this.initModel();
    this.scene.add(mug.scene);

    this.animate();
  }

  private getCanvasDimensions(): CanvasDimensions {
    return {
      width: this.canvas.nativeElement.clientWidth,
      height: this.canvas.nativeElement.clientHeight
    }
  }

  private initCamera(width: number, height: number): void {
    const {fov, near, far, position} = this.sceneConfigService.camera;
    this.camera.fov = fov;
    this.camera.aspect = width / height;
    this.camera.near = near;
    this.camera.far = far;
    this.camera.position.z = position.z;
    this.camera.updateProjectionMatrix();
  }

  private initRenderer(width: number, height: number): void {
    const {
      antialias,
      localClippingEnabled
    } = this.sceneConfigService.renderer;
    this.renderer = new WebGLRenderer({
      canvas: this.canvas.nativeElement,
      antialias
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.localClippingEnabled = localClippingEnabled;
  }

  private initRendererColor() {
    const {backgroundColorLight, backgroundColorDark} = this.sceneConfigService.renderer;
    effect(() => {
      this.renderer.setClearColor(this.themeService.isDarkMode ? backgroundColorDark : backgroundColorLight);
    });
  }

  private initDirectionalLight(): DirectionalLight {
    const {intensity, h, s, l, position, scale} = this.sceneConfigService.lights.directional;
    const directionalLight = new DirectionalLight(this.sceneConfigService.lights.color, intensity);

    directionalLight.color.setHSL(h, s, l);
    directionalLight.position.set(position.x, position.y, position.z);
    directionalLight.position.multiplyScalar(scale);

    return directionalLight;
  }

  private initOrbitControls(): void {
    const {minDistance, maxDistance, enablePan} = this.sceneConfigService.controls;

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.minDistance = minDistance;
    controls.maxDistance = maxDistance;
    controls.enablePan = enablePan;
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    if (this.isMugRotating) {
      const mug = this.scene.getObjectByName(SceneObjects.MUG);
      if (mug) mug.rotation.y += 0.01;
    }

    this.resizeRenderer();
    this.renderer.render(this.scene, this.camera);
  }

  resizeRenderer() {
    const {width, height} = this.getCanvasDimensions();
    const newAspect = width / height;
    if (this.camera.aspect !== newAspect) {
      this.camera.aspect = newAspect;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  private async initModel(): Promise<GLTF> {
    const mug: GLTF = await loadModel(MugModelPath);

    Object.keys(MugParts).forEach((key: string): void => {
      const partKey = key as MugPartKey;
      this.mugMaterialsMap.set(partKey, findMeshMaterial(mug, MugParts[partKey]));
    });

    return mug;
  }

  public updateMugColor(colorChangeEvent: ColorChangeEvent): void {
    const {key, color} = {key: colorChangeEvent.key as MugPartKey, color: colorChangeEvent.color};

    const material = this.mugMaterialsMap.get(key);

    if (material) {
      const colorRGB = parseInt(color.replace("#", "0x"), 16);
      material.color.setHex(colorRGB, SRGBColorSpace);
      material.needsUpdate = true;
    }
  }

  public updateMugLogo(file: File): void {
    const logoMaterial = this.mugMaterialsMap.get('LOGO');

    if (logoMaterial) {
      readFileAsString(file, (result: string): void => {
        loadTexture(result).then((textureMap: CanvasTexture): void => {
          textureMap.flipY = false;
          logoMaterial.map = textureMap;
          logoMaterial.needsUpdate = true;
        });
      });
    }
  }

}
