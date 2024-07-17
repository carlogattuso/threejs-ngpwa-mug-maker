import {ApplicationRef, Component, inject, PLATFORM_ID, signal, WritableSignal} from '@angular/core';
import {Button} from "primeng/button";
import {FileUploadEvent, FileUploadModule} from "primeng/fileupload";
import {ColorPickerModule} from "primeng/colorpicker";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {isPlatformBrowser, NgForOf} from "@angular/common";
import {first} from "rxjs";
import {MugComponent} from "./core/ui/mug/mug.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {DividerModule} from "primeng/divider";
import {ChipModule} from "primeng/chip";

interface Movement {
  label: string,
  value: boolean
}

@Component({
  imports: [
    DividerModule,
    Button,
    SelectButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ChipModule,
    ColorPickerModule,
    MugComponent,
    FileUploadModule,
    NgForOf
  ],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.component.scss',
  template: `
    <div class="h-screen flex">
      <div id="app-sidebar"
           class="surface-section hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 select-none shadow-1 p-3"
           style="width:280px">
        <p-divider align="left" type="solid">
          <span class="font-medium">Diseño</span>
        </p-divider>
        <div class="flex flex-column gap-2">
          <p-fileUpload
            mode="basic"
            name="demo[]"
            chooseIcon="pi pi-upload"
            styleClass="w-full"
            url="https://www.primefaces.org/cdn/api/upload.php"
            accept="image/png" maxFileSize="1000000"
            invalidFileTypeMessageSummary=""
            invalidFileTypeMessageDetail="Tipo de archivo no permitido. Extensiones permitidas: image/png"
            invalidFileSizeMessageSummary=""
            invalidFileSizeMessageDetail="Tamaño de archivo no permitido. Tamaño máximo: 10 MB"
            (onUpload)="onFileUploadAuto($event)"
            [auto]="true"
            [chooseLabel]="selectedFile ?  selectedFile.name : 'Sube tu diseño'"
          />
          <p-button label="Descargar plantilla" severity="secondary" styleClass="w-full" icon="pi pi-download"/>
        </div>
        <p-divider align="left" type="solid">
          <span class="font-medium">Movimiento</span>
        </p-divider>
        <p-selectButton
          [options]="movementState"
          [(ngModel)]="isMugMoving"
          optionLabel="label"
          optionValue="value"
          [allowEmpty]="false"/>
        <p-divider align="left" type="solid">
          <span class="font-medium">Color</span>
        </p-divider>
        <form [formGroup]="colorSelectionFormGroup">
          <div class="flex flex-wrap gap-2">
            <p-chip styleClass="pl-2 pr-3">
              <span class="w-2rem h-2rem flex align-items-center justify-content-center">
                  <p-colorPicker formControlName="mainColor"/>
              </span>
              <span class="ml-2 font-medium">
              Principal
              </span>
            </p-chip>
            <p-chip styleClass="pl-2 pr-3">
              <span class="w-2rem h-2rem flex align-items-center justify-content-center">
                  <p-colorPicker formControlName="bottomColor"/>
              </span>
              <span class="ml-2 font-medium">
              Base
              </span>
            </p-chip>
            <p-chip styleClass="pl-2 pr-3">
              <span class="w-2rem h-2rem flex align-items-center justify-content-center">
                  <p-colorPicker formControlName="innerColor"/>
              </span>
              <span class="ml-2 font-medium">
              Interior
              </span>
            </p-chip>
            <p-chip styleClass="pl-2 pr-3">
              <span class="w-2rem h-2rem flex align-items-center justify-content-center">
                  <p-colorPicker formControlName="bevelColor"/>
              </span>
              <span class="ml-2 font-medium">
              Borde
              </span>
            </p-chip>
          </div>
          <div class="flex flex-column gap-2 mt-3">
            <p-button [disabled]="colorSelectionFormGroup.untouched" label="Aplicar color" styleClass="w-full"
                      icon="pi pi-palette"/>
            <p-button [disabled]="colorSelectionFormGroup.untouched" severity="secondary" label="Restablecer colores"
                      styleClass="w-full"
                      icon="pi pi-eraser"
                      (click)="colorSelectionFormGroup.reset({
                        mainColor: '#FFFFFF',
                        bottomColor: '#FFFFFF',
                        innerColor: '#FFFFFF',
                        bevelColor: '#FFFFFF'
                      })"/>
          </div>
        </form>
      </div>
      <div class="max-h-screen flex flex-column flex-auto">
        <app-mug [isMugMoving]="this.isMugMoving"></app-mug>
      </div>
    </div>
  `
})
export class AppComponent {
  static isBrowser: WritableSignal<boolean> = signal(false);
  static isStable: WritableSignal<boolean> = signal(false);
  title: string = 'mug-maker';
  selectedFile: File | undefined;
  private platformId: object = inject(PLATFORM_ID);
  private applicationRef: ApplicationRef = inject(ApplicationRef);
  movementState: Movement[] = [{label: 'Activar', value: true}, {label: 'Desactivar', value: false}];
  isMugMoving: boolean = true;
  colorSelectionFormGroup: FormGroup = new FormGroup({
    mainColor: new FormControl('#FFFFFF'),
    bottomColor: new FormControl('#FFFFFF'),
    innerColor: new FormControl('#FFFFFF'),
    bevelColor: new FormControl('#FFFFFF')
  });

  constructor() {
    AppComponent.isBrowser.set(isPlatformBrowser(this.platformId));
    this.applicationRef.isStable.pipe(
      first((stable: boolean) => stable)
    ).subscribe((stable: boolean) => AppComponent.isStable.set(stable));
  }

  onFileUploadAuto($event: FileUploadEvent): void {
    this.selectedFile = $event.files[0];
  }

}
