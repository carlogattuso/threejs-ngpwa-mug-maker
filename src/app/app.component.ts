import {ApplicationRef, Component, inject, PLATFORM_ID, signal, WritableSignal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Button} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {SplitButtonModule} from "primeng/splitbutton";
import {ToolbarModule} from "primeng/toolbar";
import {FileUploadEvent, FileUploadModule} from "primeng/fileupload";
import {ColorPickerModule} from "primeng/colorpicker";
import {FormsModule} from "@angular/forms";
import {isPlatformBrowser, NgForOf} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {ColorDialogComponent} from "./core/ui/color-dialog/color-dialog.component";
import {first} from "rxjs";
import {MugComponent} from "./core/ui/mug/mug.component";

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
    ColorDialogComponent,
    MugComponent
  ],
  styleUrl: './app.component.scss',
  template: `
    <p-toolbar styleClass="absolute border-noround w-full shadow-1">
      <div class="p-toolbar-group-start flex flex-wrap gap-2">
        <p-fileUpload
          mode="basic"
          name="demo[]"
          chooseIcon="pi pi-upload"
          url="https://www.primefaces.org/cdn/api/upload.php"
          accept="image/*" maxFileSize="1000000"
          (onUpload)="onFileUploadAuto($event)"
          [auto]="true"
          [chooseLabel]="selectedFile ? selectedFile.name : 'Sube tu diseño'"
        />
        <p-button (onClick)="isColorSelectionVisible = true" label="Colorea tu taza"
                  icon="pi pi-palette"/>
        <p-button [outlined]="true" icon="pi pi-download" label="Descarga la plantilla"/>
        <p-button [outlined]="true" severity="danger" label="Borrar diseño" icon="pi pi-trash"/>
        <app-color-dialog (hideColorSelectionDialogEvent)="isColorSelectionVisible = false"
                          [isColorSelectionVisible]="_isColorSelectionVisible"></app-color-dialog>
      </div>
    </p-toolbar>
    <app-mug></app-mug>
  `
})
export class AppComponent {
  static isBrowser: WritableSignal<boolean> = signal(false);
  static isStable: WritableSignal<boolean> = signal(false);
  title: string = 'mug-maker';
  _isColorSelectionVisible: boolean = false;
  selectedFile: File | undefined;
  private platformId: object = inject(PLATFORM_ID);
  private applicationRef: ApplicationRef = inject(ApplicationRef);

  constructor() {
    AppComponent.isBrowser.set(isPlatformBrowser(this.platformId));
    this.applicationRef.isStable.pipe(
      first((stable: boolean) => stable)
    ).subscribe((stable: boolean) => AppComponent.isStable.set(stable));
  }

  set isColorSelectionVisible(value: boolean) {
    this._isColorSelectionVisible = value;
  }

  onFileUploadAuto($event: FileUploadEvent): void {
    this.selectedFile = $event.files[0];
  }

}
