import {UploadFileButtonComponent} from './upload-file-button.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ButtonModule} from 'primeng/button';
import {MessageModule} from 'primeng/message';
import {FormsModule} from '@angular/forms';
import {provideAnimations} from '@angular/platform-browser/animations';
import {AllowedFileExtensions, InvalidFileSizeMsg, InvalidFileTypeMsg, MaxFileSizeInMB} from "../../../app.constants";

describe('UploadFileButtonComponent', () => {
  let component: UploadFileButtonComponent;
  let fixture: ComponentFixture<UploadFileButtonComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadFileButtonComponent, ButtonModule, MessageModule, FormsModule],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadFileButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  describe('Initial State', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should display default label in upload button', () => {
      const buttonLabel = compiled.querySelector('p-button .p-button-label')?.textContent;

      expect(buttonLabel).toBe(component.defaultLabel);
    });
  });

  describe('File Upload Handling', () => {
    let fileInput: HTMLInputElement;
    const validFileSize = MaxFileSizeInMB * 1024 * 1024;
    const allowedFileExtension = AllowedFileExtensions[0];

    const createMockFile = ({name, type, size = validFileSize}: {
      name: string;
      type: string;
      size?: number;
    }) => {
      const mockFile = new File([''], name, {type});
      Object.defineProperty(mockFile, 'size', {value: size, writable: false});
      return mockFile;
    };

    const simulateFileUpload = (file: File) => {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
      fileInput?.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    };

    beforeEach(() => {
      spyOn(component.fileUploaded, 'emit');
      fileInput = compiled.querySelector('input[type="file"]') as HTMLInputElement;
    });

    it('should handle valid file upload correctly', () => {
      const validFileName = `test.${allowedFileExtension.split('/')[1]}`;
      const validFile = createMockFile({
        name: validFileName,
        type: allowedFileExtension
      });

      simulateFileUpload(validFile);

      expect(component.fileUploaded.emit).toHaveBeenCalledWith(validFile);
      expect(compiled.querySelector('p-button .p-button-label')?.textContent).toBe(validFileName);
      expect(compiled.querySelectorAll('p-message').length).toBe(0);
    });

    it('should handle invalid file upload correctly', () => {
      const invalidFile = createMockFile({
        name: 'test.a1F',
        type: 'image/a1F',
        size: validFileSize + 1
      });

      simulateFileUpload(invalidFile);

      expect(component.fileUploaded.emit).not.toHaveBeenCalled();
      expect(compiled.querySelector('p-button .p-button-label')?.textContent)
        .toBe(component.defaultLabel);

      const errorMessages = compiled.querySelectorAll('p-message');
      expect(errorMessages.length).toBe(2);
      expect(errorMessages[0].textContent).toContain(InvalidFileSizeMsg);
      expect(errorMessages[1].textContent).toContain(InvalidFileTypeMsg);
    });
  });
});
