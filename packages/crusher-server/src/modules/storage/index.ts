import { IStorageManager } from "@crusher-shared/lib/storage/interface";
import { setupStorage } from "@crusher-shared/utils/storage";
import { Service } from "typedi";


@Service()
class StorageManager implements IStorageManager {
	client: IStorageManager;

	constructor() {
		const STORAGE_MODE = process.env.STORAGE_MODE;
		const STORAGE_PORT = parseInt(process.env.STORAGE_PORT, 10);
		const BASE_STORAGE_FOLDER = process.env.BASE_STORAGE_FOLDER;

		this.client = setupStorage(STORAGE_MODE as any, STORAGE_PORT, BASE_STORAGE_FOLDER);
	}

	async getUrl(destination: string) {
		return this.client.getUrl(destination);
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
