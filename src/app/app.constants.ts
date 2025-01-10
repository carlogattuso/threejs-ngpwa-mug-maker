export const MugParts = {
  LOGO: 'Coffee-Mug_1',
  BASE: 'Coffee-Mug_3',
  BEVEL: 'Coffee-Mug_4',
  INTERIOR: 'Coffee-Mug_5',
  HANDLE: 'Coffee-Mug_6',
} as const;

export const SceneObjects = {
  MUG: 'Coffee-Mug',
} as const;

export const MugModelPath = 'mug.glb';

export const DefaultLogoPath = 'glb';

export const DefaultLogoFilename = 'logo.png';

export const MaxFileSizeInMB = 1;

export const AllowedFileExtensions = ['image/png'];

export const InvalidFileSizeMsg = `Invalid file size: ${MaxFileSizeInMB} MB`

export const InvalidFileTypeMsg = `Invalid file type: ${AllowedFileExtensions}`

export const SidebarWidthInPixels = 280;

export const SmallScreenBreakpointInPixels = 1024
