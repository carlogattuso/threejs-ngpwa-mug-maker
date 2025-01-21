import {MugParts} from "./app.constants";

export type SceneConfig = {
  lights: {
    color: number
    ambient: {
      intensity: number
    },
    directional: {
      intensity: number,
      h: number,
      s: number,
      l: number,
      position: {
        x: number,
        y: number,
        z: number,
      };
      scale: number
    }
  },
  camera: {
    fov: number,
    near: number,
    far: number,
    position: {
      z: number
    }
  },
  renderer: {
    backgroundColorLight: number
    backgroundColorDark: number
    localClippingEnabled: boolean,
    antialias: boolean
  }
  controls: {
    minDistance: number,
    maxDistance: number,
    enablePan: boolean
  }
}

export type CanvasDimensions = {
  width: number,
  height: number
}

export type MugPartKey = keyof typeof MugParts;

export enum RotationStateLabel {
  On = 'On',
  Off = 'Off'
}

export type RotationState = {
  label: string,
  value: boolean
}

export type FileValidationError = {
  message: string;
  isValid: boolean;
}

export type ColorPickerControl = {
  controlName: string,
  label: string,
  key: string
}

export type ColorChangeEvent = {
  key: string,
  color: string
}

export enum SidebarState {
  Open = 'open',
  Closed = 'closed'
}
