import { StorageManagerInterface } from "@crusher-shared/lib/storage/interface";
import * as path from "path";

export class StorageManager {
	private storageManager: StorageManagerInterface;
	private baseAssetPath: string;

	constructor(storageManager: StorageManagerInterface, baseAssetPath: string) {
		this.storageManager = storageManager;
		this.baseAssetPath = baseAssetPath;

		return this;
	}

	async uploadAsset(name: string, buffer: Buffer): Promise<string> {
		return this.storageManager.uploadBuffer(buffer, path.join("00_folder_7_day_expiration/", this.baseAssetPath, name));
	}
}
