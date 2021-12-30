import * as fs from "fs";
import { AWS_S3_VIDEO_BUCKET } from "@config/aws_bucket";
import { EDITION_TYPE } from "@shared/types/common/general";
import { AwsCloudStorage } from "@shared/lib/storage/aws";
import { LocalFileStorage } from "@shared/lib/storage";

const VIDEO_BUCKET_NAME = AWS_S3_VIDEO_BUCKET;

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

export async function uploadFileToAwsBucket(fileStorageService: any, filePath: string, fileName: string, destination = "/") {
	return new Promise((resolve, reject) => {
		const fileStream = fs.readFileSync(filePath);
		console.log(destination, fileName);
		resolve(fileStorageService.uploadBuffer(fileStream, destination + "/" + fileName));
	});
}
