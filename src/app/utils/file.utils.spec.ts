import {isFileSizeInvalid, isFileTypeInvalid, readFileAsString} from './file.utils';
import {AllowedFileExtensions, InvalidFileSizeMsg, InvalidFileTypeMsg, MaxFileSizeInMB,} from '../app.constants';

describe('FileUtils', () => {
  const createMockFile = ({
                            name = 'test.png',
                            type = AllowedFileExtensions[0],
                            size = MaxFileSizeInMB * 1024 * 1024,
                          } = {}) => {
    const mockFile = new File([''], name, {type});
    Object.defineProperty(mockFile, 'size', {value: size, writable: false});
    return mockFile;
  };

  describe('File Size Validation', () => {
    it('should accept a file with valid size', () => {
      const validFile = createMockFile();

      const result = isFileSizeInvalid(validFile);

      expect(result.isValid).toBeTrue();
      expect(result.message).toBe(InvalidFileSizeMsg);
    });

    it('should reject a file that exceeds max size', () => {
      const oversizedFile = createMockFile({
        size: (MaxFileSizeInMB * 1024 * 1024) + 1
      });

      const result = isFileSizeInvalid(oversizedFile);

      expect(result.isValid).toBeFalse();
      expect(result.message).toBe(InvalidFileSizeMsg);
    });
  });

  describe('File Type Validation', () => {
    it('should accept a file with allowed extension', () => {
      const validFile = createMockFile();

      const result = isFileTypeInvalid(validFile);

      expect(result.isValid).toBeTrue();
      expect(result.message).toBe(InvalidFileTypeMsg);
    });

    it('should reject a file with unsupported extension', () => {
      const invalidFile = createMockFile({
        name: 'test.aIF',
        type: 'image/aIF'
      });

      const result = isFileTypeInvalid(invalidFile);

      expect(result.isValid).toBeFalse();
      expect(result.message).toBe(InvalidFileTypeMsg);
    });
  });

  describe('File Reading', () => {
    it('should read file content as string', (done): void => {
      readFileAsString(createMockFile(), (result) => {
        expect(result).toContain('data:');
        expect(result).toContain('base64');
        done();
      });
    });
  });
});
