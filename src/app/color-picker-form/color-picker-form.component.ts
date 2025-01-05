import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Chip} from "primeng/chip";
import {ColorPicker, ColorPickerChangeEvent} from "primeng/colorpicker";
import {NgFor} from "@angular/common";
import {MugParts} from "../app.constants";
import {ColorChangeEvent, ColorPickerControl} from "../app.types";

@Component({
  selector: 'app-color-picker-form',
  standalone: true,
  imports: [
    Chip,
    ColorPicker,
    ReactiveFormsModule,
    NgFor
  ],
  template: `
    <form [formGroup]="mugColorsFormGroup">
      <div class="flex flex-wrap gap-2 mb-2">
        <p-chip *ngFor="let part of mugColorsControls">
            <span class="flex items-center justify-center">
                <p-colorPicker
                  [formControlName]="part.controlName"
                  (onChange)="onColorChange(part.key, $event)">
                </p-colorPicker>
            </span>
          <span class="mx-2 font-medium">
                {{ part.label }}
            </span>
        </p-chip>
      </div>
    </form>
  `,
  styleUrl: './color-picker-form.component.scss'
})
export class ColorPickerFormComponent {

  mugColorsFormGroup: FormGroup;
  mugColorsControls: ColorPickerControl[];

  @Output() colorChange = new EventEmitter<ColorChangeEvent>();

  constructor(private fb: FormBuilder) {
    this.mugColorsControls = Object.keys(MugParts).map((key): ColorPickerControl => ({
      controlName: key.toLowerCase() + 'Color',
      label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      key: key as string,
    }));

    this.mugColorsFormGroup = this.fb.group(
      Object.fromEntries(
        this.mugColorsControls.map((part: ColorPickerControl) => [part.controlName, '#FFFFFF'])
      )
    );
  }

  onColorChange(key: string, event: ColorPickerChangeEvent): void {
    this.colorChange.emit({key, color: String(event.value)});
  }

}
