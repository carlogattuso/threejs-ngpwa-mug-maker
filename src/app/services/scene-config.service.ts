import {Injectable} from '@angular/core';
import {SceneConfig} from "../app.types";

@Injectable({
  providedIn: 'root'
})
export class SceneConfigService {

  private readonly _sceneConfig: SceneConfig = {
    lights: {
      color: 0xffffff,
      ambient: {
        intensity: 0.75,
      },
      directional: {
        intensity: 2.75,
        h: 0.1,
        s: 1,
        l: 1,
        position: {
          x: -1,
          y: 1.75,
          z: 1,
        },
        scale: 30,
      },
    },
    camera: {
      fov: 30,
      near: 1,
      far: 2000,
      position: {z: 35},
    },
    renderer: {
      backgroundColorLight: 0xf8fafc,
      backgroundColorDark: 0x09090B,
      localClippingEnabled: true,
      antialias: true
    },
    controls: {
      minDistance: 1,
      maxDistance: 1000,
      enablePan: false
    },
  };

  get sceneConfig(): SceneConfig {
    return this._sceneConfig;
  }

}
