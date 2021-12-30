import { IStorageManager } from "@crusher-shared/lib/storage/interface";
import { setupStorage } from "@crusher-shared/utils/storage";
import { Service } from "typedi";

const { STORAGE_MODE, BASE_STORAGE_FOLDER } = process.env;
const STORAGE_PORT = parseInt(process.env.STORAGE_PORT, 10);

@Service()
class StorageManager implements IStorageManager {
	client: IStorageManager;

	constructor() {
		this.client = setupStorage(STORAGE_MODE as any, STORAGE_PORT, BASE_STORAGE_FOLDER);
	}

	uploadBuffer(buffer: Buffer, destionation: string): Promise<string> {
		return this.client.uploadBuffer(buffer, destionation);
	}

	upload(file: string, destination: string): Promise<string> {
		return this.client.upload(file, destination);
	}

	remove(file: string): Promise<boolean> {
		return this.client.remove(file);
	}
}

export { StorageManager };
