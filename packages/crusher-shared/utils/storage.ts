import { LocalFileStorage } from "../lib/storage";
import { AwsCloudStorage } from "../lib/storage/aws";
import { IStorageManager } from "../lib/storage/interface";

function setupStorage(storageMode: "local" | "aws", storagePort: number, baseStorageFolder: string): IStorageManager {
	if (storageMode === "local") {
		return new LocalFileStorage({
			port: storagePort,
			bucketName: "crusher-videos",
			baseFolder: baseStorageFolder,
		});
	}

	return new AwsCloudStorage({
		bucketName: "crusher-videos",
		bucketRegion: "us-east-1",
	});
}

export { setupStorage };
