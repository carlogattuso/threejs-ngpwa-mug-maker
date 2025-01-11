import {Component, signal, ViewChild} from '@angular/core';
import {MugComponent} from "./components/mug/mug.component";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {ColorChangeEvent, FileValidationError, MugPartKey} from "./app.types";
import {isFileSizeInvalid, isFileTypeInvalid, readFileAsString} from "./utils/file.utils";
import {ToolbarComponent} from "./components/toolbar/toolbar.component";

@Component({
  imports: [
    SidebarComponent,
    MugComponent,
    ToolbarComponent
  ],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.component.scss',
  template: `
    <div class="relative">
      <app-toolbar/>
      <app-mug [isMugMoving]="isMugMoving()"/>
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
