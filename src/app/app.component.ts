import {ApplicationRef, Component, computed, inject, PLATFORM_ID, Renderer2, signal, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {isPlatformBrowser, Location, NgFor, NgStyle} from "@angular/common";
import {first} from "rxjs";
import {MugComponent} from "./mug/mug.component";
import {SelectButtonModule} from "primeng/selectbutton";
import {DividerModule} from "primeng/divider";
import {DefaultLogoFilename, DefaultLogoPath} from "./app.constants";
import {FileUpload} from "primeng/fileupload";
import {isFileSizeInvalid, isFileTypeInvalid, readFileAsString} from "./utils/file.utils";
import {Message} from "primeng/message";
import {ColorChangeEvent, FileValidationError, MugPartKey, RotationState} from "./app.types";
import {ColorPickerFormComponent} from "./color-picker-form/color-picker-form.component";

@Component({
  imports: [
    DividerModule,
    Button,
    SelectButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUpload,
    MugComponent,
    Message,
    NgFor,
    ColorPickerFormComponent,
    NgStyle
  ],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.component.scss',
  template: `
    <div class="h-screen flex">

      <div
        class="shrink-0 hidden lg:block absolute lg:static select-none z-10 shadow p-4"
        style="max-width: 280px">

        <p-divider align="left" type="solid">
          <span class="font-medium">Design</span>
        </p-divider>

        <div class="flex flex-col gap-2">
          <p-button [label]="logoName ?  logoName : 'Upload your design'" icon="pi pi-upload"
                    (click)="fileInput.click()" styleClass="w-full"/>
          <ng-container *ngFor="let text of errorMessages();">
            <p-message
              severity="error"
              variant="simple"
              styleClass="flex flex-col items-center"
              [text]="text"/>
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

        <app-color-picker-form (colorChange)="onColorChange($event)"/>

      </div>

      <app-mug [ngStyle]="{ 'background-color': '#F9FAFB'}" class="grow" [isMugMoving]="isMugMoving()"></app-mug>

    </div>
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
  mugRotationStates: RotationState[] = [{label: 'On', value: true}, {label: 'Off', value: false}];
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

  onColorChange(colorChangeEvent: ColorChangeEvent): void {
    this.mugComponent.updateMaterial(colorChangeEvent.key as MugPartKey, colorChangeEvent.color);
  }
}
