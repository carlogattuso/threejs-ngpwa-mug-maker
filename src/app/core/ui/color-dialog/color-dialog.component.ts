import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {ColorPickerModule} from "primeng/colorpicker";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputGroupModule} from "primeng/inputgroup";
import {InputMaskModule} from "primeng/inputmask";

interface Color {
  main: string,
  bottom: string,
  inner: string
}

@Component({
  selector: 'app-color-dialog',
  standalone: true,
  imports: [
    Button,
    DialogModule,
    InputTextModule,
    ColorPickerModule,
    ReactiveFormsModule,
    RadioButtonModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputMaskModule,
    FormsModule
  ],
  styleUrl: './color-dialog.component.scss',
  template: `
    <p-dialog header="Configura el color"
              [modal]="true"
              [closeOnEscape]="false"
              [closable]="false"
              [(visible)]="isColorSelectionVisible"
              [draggable]="false"
              [style]="{ width: '25rem' }">
      <span tabindex="0" class="p-text-secondary block mb-5">Selecciona el conjunto de colores de tu taza.</span>
      <form [formGroup]="colorSelectionFormGroup">
        <div class="field">
          <label for="cp-hex-main" class="font-semibold w-6rem">Principal</label>
          <p-colorPicker id="cp-hex-main" formControlName="mainColor" appendTo="body" styleClass="ml-3"/>
        </div>
        <div class="field">
          <label for="cp-hex-bottom" class="font-semibold w-6rem">Base</label>
          <p-colorPicker id="cp-hex-bottom" formControlName="bottomColor" appendTo="body" styleClass="ml-3"/>
        </div>
        <div class="field mb-5">
          <label for="cp-hex-bottom" class="font-semibold w-6rem">Interior</label>
          <p-colorPicker id="cp-hex-inner" formControlName="innerColor" appendTo="body" styleClass="ml-3"/>
        </div>
      </form>
      <div class="flex justify-content-end gap-2">
        <p-button label="Cancelar" severity="secondary" (onClick)="this.hideColorSelectionDialogEvent.emit()"/>
        <p-button label="Aplicar color" (onClick)="onSaveNewColorSelection()"/>
      </div>
    </p-dialog>
  `
})
export class ColorDialogComponent {
  @Input() isColorSelectionVisible: boolean = false;
  @Output() hideColorSelectionDialogEvent: EventEmitter<Color> = new EventEmitter<Color>();
  colorSelectionFormGroup: FormGroup = new FormGroup({
    mainColor: new FormControl('#FFFFFF'),
    bottomColor: new FormControl('#FFFFFF'),
    innerColor: new FormControl('#FFFFFF'),
  });

  get colorObject(): Color {
    return this.colorSelectionFormGroup.value as Color;
  }

  onSaveNewColorSelection() {
    this.hideColorSelectionDialogEvent.emit(this.colorObject);
  }

}
