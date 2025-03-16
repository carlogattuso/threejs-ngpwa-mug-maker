import {ColorPickerFormComponent} from "./color-picker-form.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {DefaultMaterialColor, MugParts} from "../../../app.constants";
import {ColorPickerChangeEvent} from "primeng/colorpicker";

describe('ColorPickerFormComponent', () => {
  let component: ColorPickerFormComponent;
  let fixture: ComponentFixture<ColorPickerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorPickerFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ColorPickerFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('Initial State', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize controls', () => {
      const expectedControls = Object.keys(MugParts).map(key => ({
        controlName: `${key}Color`,
        key
      }));

      expect(component.mugColorsControls).toEqual(expectedControls);
    });

    it('should initialize form group with default colors', () => {
      const expectedFormControls: Record<string, string> = {};

      Object.keys(MugParts).forEach(key => {
        expectedFormControls[`${key}Color`] = DefaultMaterialColor;
      });

      expect(component.mugColorsFormGroup.value).toEqual(expectedFormControls);
    });

    it('should correctly map mugColorsControls to form group controls', () => {
      const controlNames = component.mugColorsControls.map(control => control.controlName);

      const formControlKeys = Object.keys(component.mugColorsFormGroup.controls);

      expect(formControlKeys).toEqual(jasmine.arrayContaining(controlNames));
      expect(formControlKeys.length).toBe(controlNames.length);
    });
  });

  describe('Color Change handling', () => {
    it('should emit color change event when emitColorChange is called', () => {
      spyOn(component.colorChanged, 'emit');
      const mockKey = 'test';
      const mockEvent = {value: '#FF0000'} as ColorPickerChangeEvent;

      component.emitColorChange(mockKey, mockEvent);

      expect(component.colorChanged.emit).toHaveBeenCalledWith({
        key: mockKey,
        color: '#FF0000'
      });
    });

    it('should reset all form controls to default color when resetColors is called', () => {
      const keyToReset = Object.keys(MugParts)[0];
      component.mugColorsFormGroup.get(keyToReset)?.setValue('#123456');

      spyOn(component, 'emitColorChange');

      component.resetColors();

      expect(component.emitColorChange).toHaveBeenCalledTimes(component.mugColorsControls.length);
      expect(component.emitColorChange).toHaveBeenCalledWith(
        keyToReset,
        { value: DefaultMaterialColor } as ColorPickerChangeEvent
      );
    });
  });
});
