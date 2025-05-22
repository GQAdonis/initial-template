declare module '@capawesome/capacitor-file-picker' {
  export interface FilePickerFile {
    path: string;
    name?: string;
    size?: number;
    mimeType?: string;
    [key: string]: any;
  }
  
  export interface FilePickerResult {
    files: FilePickerFile[];
  }
  
  export const FilePicker: {
    pickFiles(options: { multiple?: boolean; readableTypes?: string[] }): Promise<FilePickerResult>;
  };
}
