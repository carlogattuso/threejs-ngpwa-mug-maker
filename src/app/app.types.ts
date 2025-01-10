import {MugParts} from "./app.constants";

export type SceneConfig = {
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

export type MugPartKey = keyof typeof MugParts;

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
  Opened = 'opened',
  Closed = 'closed'
}
