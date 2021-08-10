import { LocalFileStorage } from "@shared/lib/storage";
import { AwsCloudStorage } from "@shared/lib/storage/aws";

function setupStorage() {
	if (process.env.STORAGE_MODE === "local") {
		const storagePort = parseInt(process.env.STORAGE_PORT, 10);

		return new LocalFileStorage({
			port: storagePort,
			bucketName: "crusher-videos",
			baseFolder: process.env.BASE_STORAGE_FOLDER,
		});
	}

	return new AwsCloudStorage({
		bucketName: "crusher-videos",
		bucketRegion: "us-east-1",
	});
}

export { setupStorage };
