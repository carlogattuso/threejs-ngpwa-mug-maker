import {AllowedFileExtensions, InvalidFileSizeMsg, InvalidFileTypeMsg, MaxFileSizeInMB} from "../app.constants";
import {FileValidationError} from "../app.types";

export const isFileSizeInvalid = (file: File): FileValidationError => {
  return {
    isValid: file.size < MaxFileSizeInMB * 1024 * 1024,
    message: InvalidFileSizeMsg
  };
}

export const isFileTypeInvalid = (file: File): FileValidationError => {
  return {
    isValid: AllowedFileExtensions.includes(file.type),
    message: InvalidFileTypeMsg
  }
}

export const readFileAsString = (file: File, callback: (result: string) => void): void => {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    callback(reader.result as string);
  });
  reader.readAsDataURL(file);
}
