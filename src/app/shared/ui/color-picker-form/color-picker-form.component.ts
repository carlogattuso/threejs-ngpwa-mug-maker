import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Chip} from "primeng/chip";
import {ColorPicker, ColorPickerChangeEvent} from "primeng/colorpicker";
import {NgFor} from "@angular/common";
import {Button} from "primeng/button";
import {ColorChangeEvent, ColorPickerControl} from "../../../app.types";
import {DefaultMaterialColor, MugParts} from "../../../app.constants";
import {FlexChipListComponent} from "../../../layout/flex-chip-list/flex-chip-list.component";

@Component({
  selector: 'app-color-picker-form',
  standalone: true,
  imports: [
    Chip,
    ColorPicker,
    ReactiveFormsModule,
    NgFor,
    Button,
    FlexChipListComponent
  ],
  template: `
    <form [formGroup]="mugColorsFormGroup">
      <app-flex-chip-list>
        <p-chip chip-list *ngFor="let part of mugColorsControls" styleClass="flex items-center p-2">
            <span class="flex items-center justify-center">
                <p-colorPicker styleClass="caret-transparent select-none"
                               appendTo="body"
                               [formControlName]="part.controlName"
                               (onChange)="emitColorChange(part.key, $event)">
                </p-colorPicker>
            </span>
          <span class="mx-2 font-medium">
                {{ part.key }}
            </span>
        </p-chip>
      </app-flex-chip-list>
    </form>
    <p-button label="Reset colors" size="small" icon="pi pi-eraser" styleClass="mt-4 w-full"
              (click)="resetColors()"
              [disabled]="!mugColorsFormGroup.dirty"/>
  `
})
export class ColorPickerFormComponent {
  mugColorsFormGroup: FormGroup;
  mugColorsControls: ColorPickerControl[];

  @Output() colorChanged = new EventEmitter<ColorChangeEvent>();

  constructor(private fb: FormBuilder) {
    this.mugColorsControls = this.initColorPickerControls();
    this.mugColorsFormGroup = this.initFormGroup();
  }

  private initColorPickerControls(): ColorPickerControl[] {
    return Object.keys(MugParts).map((key) => ({
      controlName: `${key}Color`,
      key
    }));
  }

  private initFormGroup(): FormGroup {
    const controls = Object.fromEntries(
      this.mugColorsControls.map((part) => [part.controlName, DefaultMaterialColor])
    );
    return this.fb.group(controls);
  }

  emitColorChange(key: string, event: ColorPickerChangeEvent): void {
    this.colorChanged.emit({key, color: String(event.value)});
  }

  resetColors(): void {
    const defaultColors = Object.fromEntries(
      this.mugColorsControls.map(({controlName}) => [controlName, DefaultMaterialColor])
    );

    this.mugColorsFormGroup.reset(defaultColors);

    this.mugColorsControls.forEach(({key}) => {
      this.emitColorChange(key, {value: DefaultMaterialColor} as ColorPickerChangeEvent);
    });
  }
}
