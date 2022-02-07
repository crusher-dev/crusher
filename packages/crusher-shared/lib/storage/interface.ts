export interface StorageManagerInterface {
	uploadBuffer: (buffer: Buffer, destionation: string) => Promise<string>;
	upload: (filePath: string, destination: string) => Promise<string>;
	remove: (filePath: string) => Promise<boolean>;
	getUrl?: (destination: string) => Promise<string>;
	getBuffer?: (destination: string) => Promise<Buffer>;
}

export type IStorageManager = StorageManagerInterface;
