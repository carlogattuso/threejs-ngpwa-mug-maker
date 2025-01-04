import {MugParts} from "./app.constants";

export type MugPartKey = keyof typeof MugParts;

export type FileValidationError = {
  message: string;
  isValid: boolean;
}
