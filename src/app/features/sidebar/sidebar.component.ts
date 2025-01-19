import {Component, EventEmitter, inject, Input, Output, Renderer2} from '@angular/core';
import {Button} from "primeng/button";
import {ColorPickerFormComponent} from "../../shared/ui/color-picker-form/color-picker-form.component";
import {Divider} from "primeng/divider";
import {Message} from "primeng/message";
import {Location, NgForOf, NgIf} from "@angular/common";
import {SelectButton} from "primeng/selectbutton";
import {DefaultLogoFilename, DefaultLogoPath} from "../../app.constants";
import {ColorChangeEvent, RotationState, RotationStateLabel} from "../../app.types";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    Button,
    ColorPickerFormComponent,
    Divider,
    Message,
    NgForOf,
    NgIf,
    SelectButton,
    FormsModule
  ],
  styleUrl: './sidebar.component.scss',
  template: `
    <p-divider align="left" type="solid">
      <span class="font-medium">Design</span>
    </p-divider>

    <div class="flex flex-col gap-2">
      <p-button [label]="_uploadedLogoName ?  _uploadedLogoName : 'Upload your design'" icon="pi pi-upload"
                (click)="fileInput.click()" styleClass="w-full"/>

      <ng-container *ngFor="let text of _errorMessages;">
        <p-message
          severity="error"
          variant="simple"
          styleClass="flex flex-col items-center"
          [text]="text"/>
      </ng-container>

      <input type="file" #fileInput accept="image/png" style="display: none"
             (change)="onLogoUploaded($event)"/>
      <p-button label="Download template" severity="secondary" icon="pi pi-download"
                (click)="downloadTemplate()" styleClass="w-full"/>
    </div>

    <p-divider align="left" type="solid">
      <span class="font-medium">Rotation</span>
    </p-divider>

    <p-selectButton
      [options]="mugRotationOptions"
      [ngModel]="isMugRotating"
      (ngModelChange)="onMugRotationChange($event)"
      optionLabel="label"
      optionValue="value"
      [allowEmpty]="false"/>

    <p-divider align="left" type="solid">
      <span class="font-medium">Color</span>
    </p-divider>

    <app-color-picker-form (colorChange)="onColorChange($event)"/>
  `
})
export class SidebarComponent {
  @Input() isMugRotating = true;
  @Output() colorChanged = new EventEmitter<ColorChangeEvent>();
  @Output() mugRotationChange = new EventEmitter<boolean>();
  @Output() logoUploaded = new EventEmitter<Event>();

  protected mugRotationOptions: RotationState[] = [
    {
      label: RotationStateLabel.On,
      value: true
    }, {
      label: RotationStateLabel.Off,
      value: false
    }
  ];
  protected _errorMessages: string[] = [];
  protected _uploadedLogoName: string | undefined

  private readonly renderer2: Renderer2 = inject(Renderer2);

  downloadTemplate(): void {
    const anchorElement: HTMLAnchorElement = this.renderer2.createElement('a');
    this.renderer2.setAttribute(anchorElement, 'href', Location.joinWithSlash(DefaultLogoPath, DefaultLogoFilename));
    this.renderer2.setAttribute(anchorElement, 'download', DefaultLogoFilename);
    anchorElement.click();
  }

  onLogoUploaded(event: Event) {
    this.logoUploaded.emit(event);
  }

  onColorChange(color: ColorChangeEvent) {
    this.colorChanged.emit(color);
  }

  onMugRotationChange(state: boolean) {
    this.mugRotationChange.emit(state)
  }
}
