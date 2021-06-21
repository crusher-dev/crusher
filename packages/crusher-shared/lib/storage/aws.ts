import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import path from 'path';

type ICloudBucketOptions = {
	bucketName: string;
	bucketRegion: string;
}

class AwsCloudStorage {
	bucketName: string;
	bucketRegion: string;
	s3BucketService: AWS.S3;

	constructor(options: ICloudBucketOptions) {
		this.bucketName = options.bucketName;
		this.bucketRegion = options.bucketRegion;

		this.s3BucketService = new AWS.S3({
			apiVersion: '2006-03-01',
			s3ForcePathStyle: true,
			signatureVersion: 'v4',
			region: this.bucketRegion
		});

		this.verifyConnection();
	}

	verifyConnection() {
		this.s3BucketService.listBuckets(function (err, data) {
			if (err) {
				console.log("Couldn't connect to crusher S3", err);
			} else {
				console.log('Successfully connected to crusher S3');
			}
		});
	}

	uploadBuffer(buffer, destination): Promise<string> {
		return new Promise((resolve, reject) => {
			this.s3BucketService.upload(
				{
					Bucket: this.bucketName,
					Key: destination,
					Body: buffer,
				},
				(err, data) => {
					if (err) {
						console.error('Encountered error while uploading to aws bucket');
						console.error(err);
						return reject(err);
					}

					const url = this.s3BucketService.getSignedUrl('getObject', {
						Bucket: this.bucketName,
						Key: data.Key,
						Expires: 60 * 60 * 24 * 5,
					});
					resolve(url);
				},
			);
		});
	}

	upload(filePath, destination): Promise<string> {
		const fileStream = fs.readFileSync(filePath);
		return this.uploadBuffer(fileStream, destination);
	}

	remove(filePath: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.s3BucketService.deleteObject({
				Bucket: this.bucketName,
				Key: filePath
			}, (err) => {
				if(err) return reject(err);
				resolve(true);
			});
		});
	}
}

export {AwsCloudStorage}
