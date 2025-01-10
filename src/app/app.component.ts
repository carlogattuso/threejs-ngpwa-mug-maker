import {Component, signal, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgFor, NgIf} from "@angular/common";
import {MugComponent} from "./components/mug/mug.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {DividerModule} from "primeng/divider";
import {Message} from "primeng/message";
import {ColorPickerFormComponent} from "./components/color-picker-form/color-picker-form.component";
import {Menubar} from "primeng/menubar";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {ColorChangeEvent, FileValidationError, MugPartKey} from "./app.types";
import {isFileSizeInvalid, isFileTypeInvalid, readFileAsString} from "./utils/file.utils";

@Component({
  imports: [
    DividerModule,
    Button,
    SelectButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MugComponent,
    Message,
    NgFor,
    ColorPickerFormComponent,
    Menubar,
    NgIf,
    SidebarComponent,
  ],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.component.scss',
  template: `
    <div class="h-screen flex">
      <app-sidebar class="shrink-0" [isMugMoving]="isMugMoving()" (logoUploaded)="handleLogoUpload($event)"
                   (colorChanged)="onColorChange($event)"/>
      <app-mug class="grow" [isMugMoving]="isMugMoving()"/>
    </div>
  `
})
export class AppComponent {
  title: string = 'mug-maker';

  @ViewChild(MugComponent) mugComponent!: MugComponent;
  @ViewChild(SidebarComponent) sidebarComponent!: SidebarComponent;

  isMugMoving = signal(true);

  handleLogoUpload($event: Event): void {
    const input = $event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (this.validateFile(file)) {
      readFileAsString(file, (result: string): void => {
        this.sidebarComponent.uploadedLogoName = file.name;
        this.mugComponent.setLogo(result);
      });
    }
  }

  validateFile(file: File): boolean {
    this.sidebarComponent.clearErrorMessages();

    const validations: FileValidationError[] = [
      isFileSizeInvalid(file),
      isFileTypeInvalid(file)
    ];

    const validationErrors = validations
      .filter(validation => !validation.isValid)
      .map(validation => validation.message);

    if (validationErrors.length > 0) {
      this.sidebarComponent.pushErrorMessages(validationErrors);
      return false;
    }

    return true;
  }

  onColorChange(colorChangeEvent: ColorChangeEvent): void {
    this.mugComponent.updateMaterial(colorChangeEvent.key as MugPartKey, colorChangeEvent.color);
  }
}
