import { AWS_BUCKET_REGION, AWS_S3_VIDEO_BUCKET } from '../../config/aws_bucket';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';

AWS.config.update({
	region: AWS_BUCKET_REGION,
});

interface iCloudBucketOptions {
	useLocalStack?: boolean;
}

export class CloudBucketManager {
	options: iCloudBucketOptions;
	s3BucketService: AWS.S3;

	constructor(options: iCloudBucketOptions) {
		this.options = options;
		this.s3BucketService = new AWS.S3({
			apiVersion: '2006-03-01',
			endpoint: options.useLocalStack ? 'http://localhost:4566' : null,
			s3ForcePathStyle: true,
			signatureVersion: 'v4',
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
					Bucket: AWS_S3_VIDEO_BUCKET,
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
						Bucket: AWS_S3_VIDEO_BUCKET,
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
}
