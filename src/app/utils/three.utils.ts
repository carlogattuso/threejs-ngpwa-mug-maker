import {CanvasTexture, ImageLoader, SRGBColorSpace} from "three";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";

export const loadTexture = (texture: string): Promise<CanvasTexture> => {
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

export const loadModel = (path: string): Promise<GLTF> => {
  return new Promise((resolve, reject): void => {
    new GLTFLoader()
      .load(path,
        async (model: GLTF): Promise<void> => {
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
