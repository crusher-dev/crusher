import * as fs from "fs";
import { AWS_S3_VIDEO_BUCKET } from "@config/aws_bucket";
import { EDITION_TYPE } from "@shared/types/common/general";
import { AwsCloudStorage } from "@shared/lib/storage/aws";
import { LocalFileStorage } from "@shared/lib/storage";

const VIDEO_BUCKET_NAME = AWS_S3_VIDEO_BUCKET;

export function getEdition() {
	return process.env.CRUSHER_MODE;
}

const LOCAL_STORAGE_ENDPOINT = process.env.LOCAL_STORAGE_ENDPOINT || "http://localhost:3001";

export const setupBucketManager = () => {
	if (process.env.STORAGE_MODE === "local") {
		const storagePort = parseInt(process.env.STORAGE_PORT, 10);

		return new LocalFileStorage({
			endpoint: LOCAL_STORAGE_ENDPOINT,
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
