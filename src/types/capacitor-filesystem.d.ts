declare module '@capacitor/filesystem' {
  export interface FileReadResult {
    data: string;
  }
  
  export interface FileWriteOptions {
    path: string;
    data: string;
    encoding: string;
  }
  
  export interface FileStatOptions {
    path: string;
  }
  
  export interface FileStatResult {
    type: string;
    size: number;
    mtime: number;
    uri: string;
  }
  
  export const Filesystem: {
    readFile(options: { path: string; encoding: string }): Promise<FileReadResult>;
    writeFile(options: FileWriteOptions): Promise<void>;
    stat(options: FileStatOptions): Promise<FileStatResult>;
  };
}
