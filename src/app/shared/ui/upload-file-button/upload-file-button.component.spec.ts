import * as fileUtilsOriginal from '../../../utils/file.utils';
import {UploadFileButtonComponent} from './upload-file-button.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ButtonModule} from 'primeng/button';
import {MessageModule} from 'primeng/message';
import {FormsModule} from '@angular/forms';
import {provideAnimations} from '@angular/platform-browser/animations';
import {AllowedFileExtensions, InvalidFileSizeMsg, InvalidFileTypeMsg, MaxFileSizeInMB} from "../../../app.constants";
import {FileUtils} from "../../../app.types";

describe('UploadFileButtonComponent', () => {
  const validFileSize = MaxFileSizeInMB * 1024 * 1024;

  let component: UploadFileButtonComponent;
  let fixture: ComponentFixture<UploadFileButtonComponent>;
  let compiled: HTMLElement;
  let fileInput: HTMLInputElement;
  let fileUtils: FileUtils;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadFileButtonComponent, ButtonModule, MessageModule, FormsModule],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadFileButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
    fileInput = compiled.querySelector('input[type="file"]') as HTMLInputElement;
    fileUtils = {...fileUtilsOriginal};

    spyOn(fileUtils, 'isFileSizeInvalid').and.callThrough();
    spyOn(fileUtils, 'isFileTypeInvalid').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default label in upload button', () => {
    expect(compiled.querySelector('p-button .p-button-label')?.textContent).toBe(component.defaultLabel);
  });

  it('should call emitLogoUploaded and update label when a valid input file is uploaded', () => {
    const allowedFileExtension: string = AllowedFileExtensions[0];
    const validFileName = 'test.'.concat(allowedFileExtension.split('/')[1]);
    const mockFile = new File([''], validFileName, {type: allowedFileExtension});
    Object.defineProperty(mockFile, 'size', {value: validFileSize, writable: false});

    fileUtils.isFileSizeInvalid = jasmine.createSpy().and.returnValue({
      isValid: true,
      message: InvalidFileSizeMsg,
    });
    fileUtils.isFileTypeInvalid = jasmine.createSpy().and.returnValue({
      isValid: true,
      message: InvalidFileTypeMsg,
    });
    spyOn(component.fileUploaded, 'emit');

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(mockFile);
    fileInput.files = dataTransfer.files;
    fileInput?.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    expect(component.fileUploaded.emit).toHaveBeenCalledWith(mockFile);
    expect(compiled.querySelector('p-button .p-button-label')?.textContent).toBe(validFileName);
    expect(compiled.querySelectorAll('p-message').length).toBe(0);
  });

  it('should show invalid file errors when an invalid input file input is uploaded', () => {
    const forbiddenFileExtension: string = 'image/a1F';
    const invalidFileName = 'test.'.concat(forbiddenFileExtension.split('/')[1]);
    const mockFile = new File([''], invalidFileName, {type: forbiddenFileExtension});
    Object.defineProperty(mockFile, 'size', {value: validFileSize + 1, writable: false});

    fileUtils.isFileSizeInvalid = jasmine.createSpy().and.returnValue({
      isValid: false,
      message: InvalidFileSizeMsg,
    });
    fileUtils.isFileTypeInvalid = jasmine.createSpy().and.returnValue({
      isValid: false,
      message: InvalidFileTypeMsg,
    });
    spyOn(component.fileUploaded, 'emit');

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(mockFile);
    fileInput.files = dataTransfer.files;
    fileInput?.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    expect(component.fileUploaded.emit).not.toHaveBeenCalled();
    expect(compiled.querySelector('p-button .p-button-label')?.textContent).toBe(component.defaultLabel);

    const errorMessages = compiled.querySelectorAll('p-message');
    expect(errorMessages.length).toBe(2);
    expect(errorMessages[0].textContent).toContain(InvalidFileSizeMsg);
    expect(errorMessages[1].textContent).toContain(InvalidFileTypeMsg);
  });
});
