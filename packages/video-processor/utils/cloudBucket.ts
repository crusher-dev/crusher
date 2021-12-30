import * as fs from "fs";
import { AwsCloudStorage } from "@shared/lib/storage/aws";
import { LocalFileStorage } from "@shared/lib/storage";

export function getEdition() {
	return process.env.CRUSHER_MODE;
}

export const setupBucketManager = () => {
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
};

export function uploadFileToAwsBucket(fileStorageService: any, filePath: string, fileName: string, destination = "/") {
	return new Promise((resolve) => {
		const fileStream = fs.readFileSync(filePath);
		console.log(destination, fileName);
		resolve(fileStorageService.uploadBuffer(fileStream, destination + "/" + fileName));
	});
}
