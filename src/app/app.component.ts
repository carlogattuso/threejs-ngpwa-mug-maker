import {
  ApplicationRef,
  Component,
  computed,
  inject,
  PLATFORM_ID,
  Renderer2,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {Button} from "primeng/button";
import {FileUploadEvent, FileUploadModule} from "primeng/fileupload";
import {ColorPickerModule} from "primeng/colorpicker";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {isPlatformBrowser, Location, NgForOf} from "@angular/common";
import {first} from "rxjs";
import {MugComponent} from "./mug/mug.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {DividerModule} from "primeng/divider";
import {ChipModule} from "primeng/chip";
import {DefaultLogoFilename, DefaultLogoPath} from "./app.constants";

interface Rotation {
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
          <span class="font-medium">Design</span>
        </p-divider>
        <div class="flex flex-column gap-2">
          <p-fileUpload
            mode="basic"
            name="demo[]"
            chooseIcon="pi pi-upload"
            styleClass="w-full"
            url="https://www.primefaces.org/cdn/api/upload.php"
            accept="image/png" maxFileSize="10000000"
            invalidFileTypeMessageSummary=""
            invalidFileTypeMessageDetail="File type not allowed. Allowed extensions: image/png"
            invalidFileSizeMessageSummary=""
            invalidFileSizeMessageDetail="File size not allowed. Maximum size: 10 MB"
            (onUpload)="onFileUploadAuto($event)"
            [auto]="true"
            [chooseLabel]="selectedLogoFile ?  selectedLogoFile.name : 'Upload your design'"
          />
          <p-button label="Download template" severity="secondary" styleClass="w-full" icon="pi pi-download"
                    (click)="downloadTemplate()"/>
        </div>
        <p-divider align="left" type="solid">
          <span class="font-medium">Rotation</span>
        </p-divider>
        <p-selectButton
          [options]="mugRotationState"
          [(ngModel)]="isMugMoving"
          optionLabel="label"
          optionValue="value"
          [allowEmpty]="false"/>
        <p-divider align="left" type="solid">
          <span class="font-medium">Color</span>
        </p-divider>
        <form [formGroup]="mugColorsFormGroup">
          <div class="flex flex-wrap gap-2">
            <p-chip styleClass="pl-2 pr-3">
              <span class="w-2rem h-2rem flex align-items-center justify-content-center">
                  <p-colorPicker formControlName="handleColor"
                                 (onChange)="mugComponent.updateMaterial('HANDLE', $event)"/>
              </span>
              <span class="ml-2 font-medium">
              Handle
              </span>
            </p-chip>
            <p-chip styleClass="pl-2 pr-3">
              <span class="w-2rem h-2rem flex align-items-center justify-content-center">
                  <p-colorPicker formControlName="baseColor"
                                 (onChange)="mugComponent.updateMaterial('BASE', $event)"/>
              </span>
              <span class="ml-2 font-medium">
              Base
              </span>
            </p-chip>
            <p-chip styleClass="pl-2 pr-3">
              <span class="w-2rem h-2rem flex align-items-center justify-content-center">
                  <p-colorPicker formControlName="interiorColor"
                                 (onChange)="mugComponent.updateMaterial('INTERIOR', $event)"/>
              </span>
              <span class="ml-2 font-medium">
              Interior
              </span>
            </p-chip>
            <p-chip styleClass="pl-2 pr-3">
              <span class="w-2rem h-2rem flex align-items-center justify-content-center">
                  <p-colorPicker formControlName="bevelColor"
                                 (onChange)="mugComponent.updateMaterial('BEVEL', $event)"/>
              </span>
              <span class="ml-2 font-medium">
              Bevel
              </span>
            </p-chip>
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
  static readonly isBrowser: WritableSignal<boolean> = signal(false);
  static readonly isStable: WritableSignal<boolean> = signal(false);
  static readonly isReady = computed(() => AppComponent.isBrowser() && AppComponent.isStable());

  private readonly platformId: object = inject(PLATFORM_ID);
  private readonly applicationRef: ApplicationRef = inject(ApplicationRef);

  title: string = 'mug-maker';

  @ViewChild(MugComponent) mugComponent!: MugComponent;
  mugRotationState: Rotation[] = [{label: 'On', value: true}, {label: 'Off', value: false}];
  isMugMoving: boolean = true;
  mugColorsFormGroup: FormGroup = new FormGroup({
    handleColor: new FormControl('#FFFFFF'),
    baseColor: new FormControl('#FFFFFF'),
    interiorColor: new FormControl('#FFFFFF'),
    bevelColor: new FormControl('#FFFFFF')
  });
  selectedLogoFile: File | undefined;
  private readonly renderer2: Renderer2 = inject(Renderer2);

  constructor() {
    AppComponent.isBrowser.set(isPlatformBrowser(this.platformId));
    this.applicationRef.isStable.pipe(
      first((stable: boolean) => stable)
    ).subscribe((stable: boolean) => AppComponent.isStable.set(stable));
  }

  onFileUploadAuto($event: FileUploadEvent): void {
    this.selectedLogoFile = $event.files[0];
    const reader: FileReader = new FileReader();

    reader.addEventListener("load", (): void => {
      this.mugComponent.setLogo(reader.result as string);
    }, false);

    if (this.selectedLogoFile) {
      reader.readAsDataURL(this.selectedLogoFile);
    }
  }

  downloadTemplate(): void {
    const anchorElement: HTMLAnchorElement = this.renderer2.createElement('a');
    this.renderer2.setAttribute(anchorElement, 'href', Location.joinWithSlash(DefaultLogoPath, DefaultLogoFilename));
    this.renderer2.setAttribute(anchorElement, 'download', DefaultLogoFilename);
    anchorElement.click();
  }

}
