import * as fs from "fs";
import { AWS_S3_VIDEO_BUCKET } from "@config/aws_bucket";
import { EDITION_TYPE } from "@shared/types/common/general";
import { AwsCloudStorage } from "@shared/lib/storage/aws";
import { LocalFileStorage } from "@shared/lib/storage";

const VIDEO_BUCKET_NAME = AWS_S3_VIDEO_BUCKET;

export function getEdition() {
	return process.env.CRUSHER_MODE;
}

const setupBucketManager = () => {
	if (process.env.NODE_ENV === "production" && getEdition() === EDITION_TYPE.EE) {
		return new AwsCloudStorage({
			bucketName: VIDEO_BUCKET_NAME,
			bucketRegion: "us-east-1",
		});
	}

	return new LocalFileStorage({ port: 3001, bucketName: VIDEO_BUCKET_NAME, baseFolder: "/tmp" });
};

// Create S3 service object
const fileStorageService = setupBucketManager();

export async function uploadFileToAwsBucket(filePath: string, fileName: string, destination = "/") {
	return new Promise((resolve, reject) => {
		const fileStream = fs.readFileSync(filePath);
		console.log(destination, fileName);
		resolve(fileStorageService.uploadBuffer(fileStream, destination + "/" + fileName));
	});
}
