import {Component, EventEmitter, Output, signal} from '@angular/core';
import {Button} from "primeng/button";
import {Message} from "primeng/message";
import {NgForOf} from "@angular/common";
import {FileValidationError} from "../../../app.types";
import {isFileSizeInvalid, isFileTypeInvalid} from "../../../utils/file.utils";

@Component({
  selector: 'app-upload-file-button',
  standalone: true,
  imports: [
    Button,
    Message,
    NgForOf
  ],
  template: `
    <p-button [label]="uploadedFileLabel ?  uploadedFileLabel : 'Upload your design'" icon="pi pi-upload"
              (click)="fileInput.click()" styleClass="w-full"/>

    <ng-container *ngFor="let text of errorMessages();">
      <p-message
        severity="error"
        variant="simple"
        styleClass="flex flex-col items-center m-2"
        [text]="text"/>
    </ng-container>

    <input type="file" #fileInput accept="image/png" style="display: none"
           (change)="emitLogoUploaded($event)"/>
  `
})
export class UploadFileButtonComponent {
  protected readonly errorMessages = signal<string[]>([]);
  protected uploadedFileLabel: string | undefined;

  @Output() fileUploaded = new EventEmitter<File>();

  validateFile(file: File): boolean {
    this.errorMessages.set([]);

    const validations: FileValidationError[] = [
      isFileSizeInvalid(file),
      isFileTypeInvalid(file)
    ];

    const validationErrors = validations
      .filter(validation => !validation.isValid)
      .map(validation => validation.message);

    if (validationErrors.length > 0) {
      this.errorMessages.set(validationErrors);
      return false;
    }

    return true;
  }

  emitLogoUploaded(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (this.validateFile(file)) {
      this.uploadedFileLabel = file.name;
      this.fileUploaded.emit(file);
    }
  }
}
