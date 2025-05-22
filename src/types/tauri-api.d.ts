declare module '@tauri-apps/api' {
  export function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T>;
  
  export namespace fs {
    export function readTextFile(path: string): Promise<string>;
    export function writeTextFile(path: string, contents: string): Promise<void>;
    export function metadata(path: string): Promise<any>;
  }

  export namespace dialog {
    export interface OpenDialogOptions {
      multiple?: boolean;
      filters?: Record<string, string[]>;
    }

    export interface SaveDialogOptions {
      defaultPath?: string;
      filters?: Record<string, string[]>;
    }

    export function open(options?: OpenDialogOptions): Promise<string | string[]>;
    export function save(options?: SaveDialogOptions): Promise<string>;
  }
}
