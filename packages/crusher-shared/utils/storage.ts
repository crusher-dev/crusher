import { LocalFileStorage } from "../lib/storage";
import { AwsCloudStorage } from "../lib/storage/aws";
import { IStorageManager } from "../lib/storage/interface";
const LOCAL_STORAGE_ENDPOINT = process.env.LOCAL_STORAGE_ENDPOINT || "http://localhost:3001";

function setupStorage(storageMode: "local" | "aws", storagePort: number, baseStorageFolder: string): IStorageManager {
	console.log("Storage mode is", storageMode);
	if (storageMode === "local" || !storageMode) {
		return new LocalFileStorage({
			endpoint: LOCAL_STORAGE_ENDPOINT,
		});
	}

	return new AwsCloudStorage({
		bucketName: "crusher-videos",
		bucketRegion: "us-east-1",
	});
}

export { setupStorage };
