import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as url from "url";

import { StorageManagerInterface } from "./interface";

type ICloudBucketOptions = {
	bucketName: string;
	bucketRegion: string;
};

class AwsCloudStorage implements StorageManagerInterface {
	bucketName: string;
	bucketRegion: string;
	s3BucketService: AWS.S3;

	constructor(options: ICloudBucketOptions) {
		this.bucketName = options.bucketName;
		this.bucketRegion = options.bucketRegion;

		this.s3BucketService = new AWS.S3({
			apiVersion: "2006-03-01",
			s3ForcePathStyle: true,
			signatureVersion: "v4",
			region: this.bucketRegion,
		});

		this.verifyConnection();
	}

	verifyConnection() {
		this.s3BucketService.listBuckets(function (err, data) {
			if (err) {
				console.log("Couldn't connect to crusher S3", err);
			} else {
				console.log("Successfully connected to crusher S3");
			}
		});
	}

	uploadBuffer(buffer: Buffer, destination: string): Promise<string> {
		return new Promise((resolve, reject) => {
			this.s3BucketService.upload(
				{
					Bucket: this.bucketName,
					Key: destination,
					Body: buffer,
				},
				(err, data) => {
					if (err) {
						console.error("Encountered error while uploading to aws bucket");
						console.error(err);
						return reject(err);
					}

					resolve(destination);
				},
			);
		});
	}

	upload(filePath: string, destination: string): Promise<string> {
		const fileStream = fs.readFileSync(filePath);
		return this.uploadBuffer(fileStream, destination);
	}

	remove(filePath: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.s3BucketService.deleteObject(
				{
					Bucket: this.bucketName,
					Key: filePath,
				},
				(err) => {
					if (err) return reject(err);
					resolve(true);
				},
			);
		});
	}

	async getUrl(destionation: string) {
		return url.resolve(`https://${this.bucketName}.s3.amazonaws.com/`, destionation);
	}
}

export { AwsCloudStorage };
