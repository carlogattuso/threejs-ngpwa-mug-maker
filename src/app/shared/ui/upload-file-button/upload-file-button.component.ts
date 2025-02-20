import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
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
    <p-button [label]="label" icon="pi pi-upload"
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
  errorMessages = signal<string[]>([]);

  @Input() label: string = 'Upload your design';
  @Output() fileUploaded = new EventEmitter<File>();

  private validateFile(file: File): boolean {
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
      this.label = file.name;
      this.fileUploaded.emit(file);
    }
  }
}
