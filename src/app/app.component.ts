import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Button} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {SplitButtonModule} from "primeng/splitbutton";
import {ToolbarModule} from "primeng/toolbar";
import {FileSelectEvent, FileUploadModule} from "primeng/fileupload";
import {ColorPickerModule} from "primeng/colorpicker";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {ColorDialogComponent} from "./core/ui/color-dialog/color-dialog.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Button,
    InputTextModule,
    SplitButtonModule,
    ToolbarModule,
    FileUploadModule,
    ColorPickerModule,
    FormsModule,
    NgForOf,
    DialogModule,
    ColorDialogComponent
  ],
  styleUrl: './app.component.scss',
  template: `
    <p-toolbar styleClass="shadow-1">
      <div class="p-toolbar-group-start">
        <p-fileUpload
          mode="basic"
          name="demo[]"
          chooseIcon="pi pi-upload"
          accept="image/*"
          maxFileSize="1000000"
          (onSelect)="onSelectDesign($event)"
          [chooseLabel]="selectedFilename"
          [auto]="true"
          class="mr-2"
        />
        <p-button [outlined]="true" icon="pi pi-download" label="Descarga la plantilla"/>
      </div>
      <div class="p-toolbar-group-center">
        <p-button (onClick)="isColorSelectionVisible = true" severity="secondary" label="Personalizar colores"
                  icon="pi pi-palette"/>
        <app-color-dialog (hideColorSelectionDialogEvent)="isColorSelectionVisible = false"
                          [isColorSelectionVisible]="_isColorSelectionVisible"></app-color-dialog>
      </div>
      <div class="p-toolbar-group-end">
        <p-button [outlined]="true" severity="danger" label="Borrar diseño" icon="pi pi-trash"/>
      </div>
    </p-toolbar>
  `
})
export class AppComponent {
  title = 'mug-maker';
  _isColorSelectionVisible: boolean = false;
  selectedFilename: string = "Sube tu diseño";

  onSelectDesign(event: FileSelectEvent) {
    this.selectedFilename = event.files[0].name;
    console.log('design uploaded');
  }

  set isColorSelectionVisible(value: boolean) {
    this._isColorSelectionVisible = value;
  }
}
