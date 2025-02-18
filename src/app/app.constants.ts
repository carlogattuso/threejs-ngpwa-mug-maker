export const MugParts = {
  Logo: 'Coffee-Mug_1',
  Base: 'Coffee-Mug_3',
  Bevel: 'Coffee-Mug_4',
  Interior: 'Coffee-Mug_5',
  Handle: 'Coffee-Mug_6',
} as const;

export const SceneObjects = {
  Mug: 'Coffee-Mug',
} as const;

export const MugModelPath = 'mug.glb';

export const DefaultLogoPath = 'glb';

export const DefaultLogoFilename = 'logo.png';

export const DefaultLogo = 'glb/default.png';

export const DefaultMaterialColor = '#FFFFFF';

export const MaxFileSizeInMB = 10;

export const AllowedFileExtensions = ['image/png'];

export const InvalidFileSizeMsg = `Invalid file size: ${MaxFileSizeInMB} MB`

export const InvalidFileTypeMsg = `Invalid file type: ${AllowedFileExtensions}`
