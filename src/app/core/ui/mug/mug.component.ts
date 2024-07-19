import {Component, effect, ElementRef, inject, Input, Renderer2, ViewChild} from '@angular/core';
import {AppComponent} from "../../../app.component";
import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  MeshPhysicalMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader.js";
import {ThreeUtility} from "../../../utility/three.utility";
import {ColorPickerChangeEvent} from "primeng/colorpicker";

@Component({
  selector: 'app-mug',
  standalone: true,
  imports: [],
  styleUrl: './mug.component.scss',
  template: `
    <canvas #canvas class="h-screen w-full"></canvas>
  `
})
export class MugComponent {

  camera!: PerspectiveCamera;
  scene: Scene = new Scene();
  ambientLight: AmbientLight = new AmbientLight(0xffffff, 0.75);
  directionalLight: DirectionalLight = new DirectionalLight(0xffffff, 2.75);
  webGLRenderer?: WebGLRenderer;
  controls?: OrbitControls;
  logoMaterial?: MeshPhysicalMaterial;
  baseMaterial?: MeshPhysicalMaterial;
  innerMaterial?: MeshPhysicalMaterial;
  bevelMaterial?: MeshPhysicalMaterial;
  handleMaterial?: MeshPhysicalMaterial;
  @ViewChild('canvas') canvas!: ElementRef;
  canvasElement!: HTMLElement;
  private renderer: Renderer2 = inject(Renderer2);
  @Input() isMugMoving: boolean = true;

  constructor() {
    effect((): void => {
      if (AppComponent.isBrowser() && AppComponent.isStable()) {
        this.initThree();
      }
    });
  }

  async initThree(): Promise<void> {
    this.camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2000);
    this.camera.position.z = 35;

    this.directionalLight.color.setHSL(0.1, 1, 0.95);
    this.directionalLight.position.set(-1, 1.75, 1);
    this.directionalLight.position.multiplyScalar(30);
    this.camera.add(this.directionalLight);

    /**
     * Scene settings
     */
    this.scene.add(this.camera);
    this.scene.add(this.ambientLight);

    /**
     * Renderer settings
     */
    this.canvasElement = this.renderer.selectRootElement(this.canvas.nativeElement, true);
    this.webGLRenderer = new WebGLRenderer({canvas: this.canvasElement, antialias: true});
    this.webGLRenderer.setPixelRatio(window.devicePixelRatio);
    this.webGLRenderer.setClearColor(0xF9FAFB);
    this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    this.webGLRenderer.localClippingEnabled = true;

    /**
     * Orbit Controls settings
     */
    this.controls = new OrbitControls(this.camera, this.webGLRenderer.domElement);
    this.controls.minDistance = 1;
    this.controls.maxDistance = 1000;
    this.controls.enablePan = false;

    /**
     * Mug settings
     */

    const mug: GLTF = await ThreeUtility.loadModel('glb/mug.glb');
    this.logoMaterial = (mug.scene.getObjectByName('Coffee-Mug_1') as Mesh).material as MeshPhysicalMaterial;
    this.baseMaterial = (mug.scene.getObjectByName('Coffee-Mug_3') as Mesh).material as MeshPhysicalMaterial;
    this.bevelMaterial = (mug.scene.getObjectByName('Coffee-Mug_4') as Mesh).material as MeshPhysicalMaterial;
    this.innerMaterial = (mug.scene.getObjectByName('Coffee-Mug_5') as Mesh).material as MeshPhysicalMaterial;
    this.handleMaterial = (mug.scene.getObjectByName('Coffee-Mug_6') as Mesh).material as MeshPhysicalMaterial;

    this.scene.add(mug.scene);
    this.animate();
  }

  animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    if (this.isMugMoving) {
      const mug: Object3D | undefined = this.scene.getObjectByName('Coffee-Mug');
      if (mug) mug.rotation.y += 0.01;
    }
    this.render();
  }


  render(): void {
    if (this.canvas)
      this.onWindowResize(this.canvasElement.clientWidth, this.canvasElement.clientHeight);
    this.webGLRenderer?.render(this.scene, this.camera);
  }

  onWindowResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.webGLRenderer?.setSize(width, height);
  }

  async setLogo(texture: string) {
    if (this.logoMaterial) {
      this.logoMaterial.map = await ThreeUtility.loadTexture(texture);
      this.logoMaterial.map.flipY = false;
      this.logoMaterial.needsUpdate = true;
    }
  }

  updateMaterial(material: MeshPhysicalMaterial | undefined, event: ColorPickerChangeEvent) {
    const colorRGB: number = parseInt(String(event.value).replace("#", "0x"), 16);
    if (material) {
      material.color.setHex(colorRGB, SRGBColorSpace);
      material.needsUpdate = true;
    }
  }
}
