export interface StorageManagerInterface {
    uploadBuffer: (buffer: Buffer, destionation: string) => Promise<string>;
    upload: (filePath: string, destination: string) => Promise<string>;
    remove: (filePath: string) => Promise<boolean>;
}