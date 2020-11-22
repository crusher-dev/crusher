import * as fs from 'fs';
import { Bucket, Storage } from '@google-cloud/storage';
import { CLOUD_API_CREDENTIALS, CLOUD_PROJECT_ID, GCP_IMAGES_BUCKET } from '../config/google_cloud';
import { JobPlatform } from '../src/interfaces/JobPlatform';
import * as AWS from 'aws-sdk';
import { AWS_ACCESS_KEY_ID, AWS_BUCKET_REGION, AWS_S3_VIDEO_BUCKET, AWS_SECRET_ACCESS_KEY } from '../config/aws_bucket';

const TESTS_BUCKET_NAME = GCP_IMAGES_BUCKET;
const VIDEO_BUCKET_NAME = AWS_S3_VIDEO_BUCKET;

const storage: Storage = new Storage({
	projectId: CLOUD_PROJECT_ID,
	credentials: CLOUD_API_CREDENTIALS,
});

// Load the SDK for JavaScript
// Set the Region
AWS.config.update({
	region: AWS_BUCKET_REGION,
});

// Create S3 service object
const s3BucketService = new AWS.S3({
	apiVersion: '2006-03-01',
	endpoint: 'http://localhost:4566',
	s3ForcePathStyle: true,
	signatureVersion: 'v4',
});

// Call S3 to list the buckets
s3BucketService.listBuckets(function(err, data) {
	if (err) {
		console.log('Error', err);
	} else {
		console.log('Success', data.Buckets);
	}
});

const testImagesBucket = storage.bucket(TESTS_BUCKET_NAME);

export async function uploadFileToBucket(bucket: Bucket, filePath: string, fileName: string, destination: string = '/') {
	await bucket.upload(filePath, {
		destination: destination + '/' + fileName,
		gzip: true,
		metadata: {
			cacheControl: 'public, max-age=31536000',
		},
	});

	console.log(`${filePath} uploaded to ${bucket.name} bucket.`);
}

export async function uploadFileToAwsBucket(s3Bucket, filePath: string, fileName: string, destination: string = '/') {
	return new Promise((resolve, reject) => {
		const fileStream = fs.createReadStream(filePath);
		fileStream.on('error', function(err) {
			reject({ message: 'File Error', err: err });
		});

		console.log({
			Bucket: VIDEO_BUCKET_NAME,
			Key: destination + '/' + fileName,
			filePath,
		});
		s3Bucket.upload(
			{
				Bucket: VIDEO_BUCKET_NAME,
				Key: destination + '/' + fileName,
				Body: fileStream,
			},
			function(err, data) {
				if (err) reject({ message: 'File upload failed', err: err });

				const url = s3BucketService.getSignedUrl('getObject', {
					Bucket: VIDEO_BUCKET_NAME,
					Key: data.Key,
					Expires: 60 * 60 * 24 * 5,
				});

				console.log(`${filePath} uploaded to ${VIDEO_BUCKET_NAME} aws bucket.`);
				resolve(url);
			},
		);
	});
}

export async function uploadAllScreenshotsToTestBucket(typeWithInstanceId: string, instanceId: number, platform: JobPlatform) {
	try {
		const images = fs.readdirSync(`/tmp/images/${instanceId}/${platform}`);
		const publicImageUrls = [];
		for (let image of images) {
			await uploadFileToBucket(testImagesBucket, `/tmp/images/${instanceId}/${platform}/` + image, image, typeWithInstanceId);
			const file = testImagesBucket.file(typeWithInstanceId + '/' + image);
			const signedUrls = await file.getSignedUrl({
				action: 'read',
				expires: '03-09-2491',
			});
			if (signedUrls && signedUrls.length) {
				publicImageUrls.push({
					name: image,
					url: signedUrls[0] + `&sbtnca=${Date.now()}`,
				});
			}
		}
		return publicImageUrls;
	} catch (err) {
		throw err;
		return [];
	}
}

export async function uploadRecordedVideoToBucketIfAny(typeWithInstanceId: string, instanceId: number, platform: JobPlatform) {
	try {
		const videos = fs.readdirSync(`/tmp/video/${instanceId}/${platform}`);
		const publicVideoUrls = [];

		for (let video of videos) {
			const signedUrl = await uploadFileToAwsBucket(
				s3BucketService,
				`/tmp/video/${instanceId}/${platform}/${video}`,
				`${instanceId}.mp4.raw`,
				typeWithInstanceId,
			);
			publicVideoUrls.push({
				name: video,
				url: signedUrl + `&sbtnca=${Date.now()}`,
			});
		}
		return publicVideoUrls[0];
	} catch (err) {
		return null;
	}
}
