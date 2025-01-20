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
import {FlexButtonListComponent} from "../../layout/flex-button-list/flex-button-list.component";
import {UploadFileButtonComponent} from "../../shared/ui/upload-file-button/upload-file-button.component";

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
    FormsModule,
    FlexButtonListComponent,
    UploadFileButtonComponent
  ],
  template: `
    <p-divider align="left" type="solid">
      <span class="font-medium">Design</span>
    </p-divider>

    <app-flex-button-list>
      <app-upload-file-button (fileUploaded)="fileUploaded.emit($event)"/>
      <p-button label="Download template" severity="secondary" icon="pi pi-download"
                (click)="downloadTemplate()" styleClass="w-full"/>
    </app-flex-button-list>

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

    <app-color-picker-form (colorChanged)="colorChanged.emit($event)"/>
  `
})
export class SidebarComponent {
  @Input() isMugRotating = true;
  @Output() colorChanged = new EventEmitter<ColorChangeEvent>();
  @Output() fileUploaded = new EventEmitter<File>();
  @Output() mugRotationChange = new EventEmitter<boolean>();

  protected mugRotationOptions: RotationState[] = [
    {
      label: RotationStateLabel.On,
      value: true
    }, {
      label: RotationStateLabel.Off,
      value: false
    }
  ];

  private readonly renderer2: Renderer2 = inject(Renderer2);

  downloadTemplate(): void {
    const anchorElement: HTMLAnchorElement = this.renderer2.createElement('a');
    this.renderer2.setAttribute(anchorElement, 'href', Location.joinWithSlash(DefaultLogoPath, DefaultLogoFilename));
    this.renderer2.setAttribute(anchorElement, 'download', DefaultLogoFilename);
    anchorElement.click();
  }

  onMugRotationChange(state: boolean) {
    this.mugRotationChange.emit(state)
  }
}
