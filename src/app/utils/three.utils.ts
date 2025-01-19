import {CanvasTexture, ImageLoader, Mesh, MeshPhysicalMaterial, SRGBColorSpace} from "three";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {DefaultLogo, MugParts} from "../app.constants";

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
          const texture: CanvasTexture = await loadTexture(DefaultLogo);

          const material = findMeshMaterial(model, MugParts['LOGO']);
          material.map!.image = texture.image;
          material.needsUpdate = true;

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

export const findMeshMaterial = (model: GLTF, name: string): MeshPhysicalMaterial => {
  return (model.scene.getObjectByName(name) as Mesh).material as MeshPhysicalMaterial;
}
