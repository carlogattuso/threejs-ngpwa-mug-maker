import {ApplicationRef, Component, computed, inject, PLATFORM_ID, Renderer2, signal, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {ColorPickerModule} from "primeng/colorpicker";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {isPlatformBrowser, Location, NgFor} from "@angular/common";
import {first} from "rxjs";
import {MugComponent} from "./mug/mug.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {DividerModule} from "primeng/divider";
import {ChipModule} from "primeng/chip";
import {DefaultLogoFilename, DefaultLogoPath} from "./app.constants";
import {FileUpload} from "primeng/fileupload";
import {isFileSizeInvalid, isFileTypeInvalid, readFileAsString} from "./utils/file.utils";
import {Message} from "primeng/message";
import {FileValidationError} from "./app.types";

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
    FileUpload,
    MugComponent,
    Message,
    NgFor
  ],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.component.scss',
  template: `
    <div class="bg-surface-0 absolute z-10 shadow rounded-md p-4 m-4 sm:w-full md:w-1/2 lg:w-1/4"
         style="max-width:600px">

      <p-divider align="left" type="solid">
        <span class="font-medium">Design</span>
      </p-divider>

      <div class="flex flex-col gap-2">
        <p-button [label]="logoName ?  logoName : 'Upload your design'" icon="pi pi-upload"
                  (click)="fileInput.click()" styleClass="w-full"/>
        <ng-container *ngFor="let text of errorMessages(); let first = first">
          <p-message
            severity="error"
            [text]="text">
          </p-message>
        </ng-container>
        <input type="file" #fileInput accept="image/png" style="display: none"
               (change)="handleLogoUpload($event)"/>
        <p-button label="Download template" severity="secondary" icon="pi pi-download"
                  (click)="downloadTemplate()" styleClass="w-full"/>
      </div>

      <p-divider align="left" type="solid">
        <span class="font-medium">Rotation</span>
      </p-divider>

      <p-selectButton
        [options]="mugRotationStates"
        [(ngModel)]="isMugMoving"
        optionLabel="label"
        optionValue="value"
        [allowEmpty]="false"/>

      <p-divider align="left" type="solid">
        <span class="font-medium">Color</span>
      </p-divider>

      <form [formGroup]="mugColorsFormGroup">
        <div class="flex flex-wrap gap-2 mb-2">
          <p-chip>
              <span class="flex items-center justify-center">
                  <p-colorPicker formControlName="handleColor"
                                 (onChange)="mugComponent.updateMaterial('HANDLE', $event)"/>
              </span>
            <span class="ml-2 font-medium">
              Handle
              </span>
          </p-chip>
          <p-chip>
              <span class="flex items-center justify-center">
                  <p-colorPicker formControlName="baseColor"
                                 (onChange)="mugComponent.updateMaterial('BASE', $event)"/>
              </span>
            <span class="ml-2 font-medium">
              Base
              </span>
          </p-chip>
          <p-chip>
              <span class="flex items-center justify-center">
                  <p-colorPicker formControlName="interiorColor"
                                 (onChange)="mugComponent.updateMaterial('INTERIOR', $event)"/>
              </span>
            <span class="ml-2 font-medium">
              Interior
              </span>
          </p-chip>
          <p-chip>
              <span class="flex items-center justify-center">
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

    <app-mug [isMugMoving]="isMugMoving()"></app-mug>
  `
})
export class AppComponent {
  private static readonly isBrowser = signal(false);
  private static readonly isStable = signal(false);
  static readonly isReady = computed(() => AppComponent.isBrowser() && AppComponent.isStable());

  private readonly platformId: object = inject(PLATFORM_ID);
  private readonly applicationRef: ApplicationRef = inject(ApplicationRef);

  title: string = 'mug-maker';

  @ViewChild(MugComponent) mugComponent!: MugComponent;
  isMugMoving = signal(true);
  mugRotationStates: Rotation[] = [{label: 'On', value: true}, {label: 'Off', value: false}];
  mugColorsFormGroup: FormGroup = new FormGroup({
    handleColor: new FormControl('#FFFFFF'),
    baseColor: new FormControl('#FFFFFF'),
    interiorColor: new FormControl('#FFFFFF'),
    bevelColor: new FormControl('#FFFFFF')
  });
  logoName: string | undefined;
  errorMessages = signal<string[]>([]);
  private readonly renderer2: Renderer2 = inject(Renderer2);

  constructor() {
    AppComponent.isBrowser.set(isPlatformBrowser(this.platformId));
    this.applicationRef.isStable.pipe(
      first((stable: boolean) => stable)
    ).subscribe((stable: boolean) => AppComponent.isStable.set(stable));
  }

  handleLogoUpload($event: Event): void {
    const input = $event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (this.validateFile(file)) {
      readFileAsString(file, (result: string): void => {
        this.logoName = file.name;
        this.mugComponent.setLogo(result);
      });
    }
  }

  validateFile(file: File): boolean {
    this.clearErrorMessages();

    const validations: FileValidationError[] = [
      isFileSizeInvalid(file),
      isFileTypeInvalid(file)
    ];

    const validationErrors = validations
      .filter(validation => !validation.isValid)
      .map(validation => validation.message);

    if (validationErrors.length > 0) {
      this.pushErrorMessages(validationErrors);
      return false;
    }

    return true;
  }

  pushErrorMessages(messages: string[]) {
    this.errorMessages.set(messages);
  }

  clearErrorMessages() {
    this.errorMessages.set([]);
  }

  downloadTemplate(): void {
    const anchorElement: HTMLAnchorElement = this.renderer2.createElement('a');
    this.renderer2.setAttribute(anchorElement, 'href', Location.joinWithSlash(DefaultLogoPath, DefaultLogoFilename));
    this.renderer2.setAttribute(anchorElement, 'download', DefaultLogoFilename);
    anchorElement.click();
  }

}
