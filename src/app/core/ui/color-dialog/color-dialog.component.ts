import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {ColorPickerModule} from "primeng/colorpicker";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputGroupModule} from "primeng/inputgroup";

interface Color {
  label: string,
  value: string
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
    InputGroupModule
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
        <div class="flex align-items-center gap-3 mb-3">
          <label for="cp-hex-main" class="font-semibold w-6rem">Principal</label>
          <p-colorPicker id="cp-hex-main" formControlName="mainColor" appendTo="body"/>
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="cp-hex-bottom" class="font-semibold w-6rem">Base</label>
          <p-colorPicker id="cp-hex-bottom" formControlName="bottomColor" appendTo="body"/>
        </div>
        <div class="flex align-items-center gap-3 mb-5">
          <label for="cp-hex-bottom" class="font-semibold w-6rem">Interior</label>
          <p-colorPicker id="cp-hex-inner" formControlName="innerColor" appendTo="body"/>
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
  @Output() hideColorSelectionDialogEvent: EventEmitter<void> = new EventEmitter<void>();
  colorSelectionFormGroup: FormGroup = new FormGroup({
    mainColor: new FormControl('#FFFFFF'),
    bottomColor: new FormControl('#FFFFFF'),
    innerColor: new FormControl('#FFFFFF'),
  });

  onSaveNewColorSelection() {
    this.hideColorSelectionDialogEvent.emit();
  }
}
