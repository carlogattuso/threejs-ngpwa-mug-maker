import {CanvasTexture, ImageLoader, Mesh, MeshPhysicalMaterial, SRGBColorSpace} from "three";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";

export class ThreeUtility {

  static loadTexture(texture: string): Promise<CanvasTexture> {
    return new Promise((resolve, reject): void => {
      new ImageLoader()
        .load(texture,
          (image: HTMLImageElement): void => {
            const texture: CanvasTexture = new CanvasTexture(image);
            texture.colorSpace = SRGBColorSpace;
            resolve(texture);
          },
          (): void => {
          },
          (error: unknown): void => {
            reject(error);
          }
        );
    });
  }

  static loadModel(path: string): Promise<GLTF> {
    return new Promise((resolve, reject): void => {
      new GLTFLoader()
        .load(path,
          async (model: GLTF): Promise<void> => {
            const texture: CanvasTexture = await this.loadTexture('glb/sopra.jpg');
            const material1: MeshPhysicalMaterial = (model.scene.getObjectByName('Coffee-Mug_1') as Mesh).material as MeshPhysicalMaterial;
            const material2: MeshPhysicalMaterial = (model.scene.getObjectByName('Coffee-Mug_2') as Mesh).material as MeshPhysicalMaterial;
            material1.map!.image = texture.image;
            material1.needsUpdate = true;
            material2.map!.image = texture.image;
            material2.needsUpdate = true;
            resolve(model);
          },
          (): void => {
          },
          (error: unknown): void => {
            reject(error);
          }
        );
    });
  }

}
