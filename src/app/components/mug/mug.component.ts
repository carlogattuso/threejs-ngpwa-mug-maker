import {Component, ElementRef, HostListener, inject, Input, OnInit, ViewChild} from '@angular/core';
import {AmbientLight, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {loadModel} from "../../utils/three.utils";
import {MugModelPath, SceneObjects} from "../../app.constants";
import {SceneConfigService} from "../../services/scene-config.service";
import {CanvasDimensions} from "../../app.types";

@Component({
  selector: 'app-mug',
  standalone: true,
  imports: [],
  template: `
    <canvas #canvas class="!h-screen !w-full"></canvas>
  `
})
export class MugComponent implements OnInit {
  @Input() isMugMoving = true;

  @ViewChild('canvas', {static: true})
  private readonly canvas!: ElementRef<HTMLCanvasElement>;
  private readonly sceneConfig = inject(SceneConfigService).sceneConfig;
  
  private scene = new Scene();
  private camera = new PerspectiveCamera();
  private renderer = new WebGLRenderer();

  async ngOnInit(): Promise<void> {
    const {width, height} = this.getCanvasDimensions();

    this.initCamera(width, height);
    this.initRenderer(width, height);
    this.initOrbitControls();

    const directionalLight: DirectionalLight = this.initDirectionalLight();
    const ambientLight: AmbientLight = new AmbientLight(this.sceneConfig.lights.color, this.sceneConfig.lights.ambient.intensity);

    this.camera.add(directionalLight);
    this.scene.add(this.camera);
    this.scene.add(ambientLight);
    this.scene.add((await loadModel(MugModelPath)).scene);

    this.animate();
  }

  @HostListener('window:resize')
  onResize() {
    const {width, height} = this.getCanvasDimensions();

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private getCanvasDimensions(): CanvasDimensions {
    return {
      width: this.canvas.nativeElement.clientWidth,
      height: this.canvas.nativeElement.clientHeight
    }
  }

  private initCamera(width: number, height: number): void {
    const {fov, near, far, position} = this.sceneConfig.camera;
    this.camera.fov = fov;
    this.camera.aspect = width / height;
    this.camera.near = near;
    this.camera.far = far;
    this.camera.position.z = position.z;
    this.camera.updateProjectionMatrix();
  }

  private initRenderer(width: number, height: number): void {
    const {antialias, localClippingEnabled, backgroundColor} = this.sceneConfig.renderer;
    this.renderer = new WebGLRenderer({
      canvas: this.canvas.nativeElement,
      antialias
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(backgroundColor);
    this.renderer.setSize(width, height);
    this.renderer.localClippingEnabled = localClippingEnabled;
  }

  private initDirectionalLight(): DirectionalLight {
    const {intensity, h, s, l, position, scale} = this.sceneConfig.lights.directional;
    const directionalLight = new DirectionalLight(this.sceneConfig.lights.color, intensity);

    directionalLight.color.setHSL(h, s, l);
    directionalLight.position.set(position.x, position.y, position.z);
    directionalLight.position.multiplyScalar(scale);

    return directionalLight;
  }

  private initOrbitControls(): void {
    const {minDistance, maxDistance, enablePan} = this.sceneConfig.controls;

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.minDistance = minDistance;
    controls.maxDistance = maxDistance;
    controls.enablePan = enablePan;
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    if (this.isMugMoving) {
      const mug = this.scene.getObjectByName(SceneObjects.MUG);
      if (mug) mug.rotation.y += 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  }

}
