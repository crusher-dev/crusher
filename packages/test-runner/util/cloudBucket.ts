import * as fs from 'fs';
import { JobPlatform } from '../src/interfaces/JobPlatform';
import * as AWS from 'aws-sdk';
import { AWS_BUCKET_REGION, AWS_S3_VIDEO_BUCKET } from '../config/aws_bucket';

const VIDEO_BUCKET_NAME = AWS_S3_VIDEO_BUCKET;

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
		const images = fs.readdirSync(`/tmp/${instanceId}/${platform}/images`);
		const publicImageUrls = [];
		for (let image of images) {
			const signedUrl = await uploadFileToAwsBucket(s3BucketService, `/tmp/${instanceId}/${platform}/images/${image}`, image, typeWithInstanceId);
			publicImageUrls.push({
				name: image,
				url: signedUrl + `&sbtnca=${Date.now()}`,
			});
		}
		return publicImageUrls;
	} catch (err) {
		return [];
	}
}

export async function uploadRecordedVideoToBucketIfAny(typeWithInstanceId: string, instanceId: number, platform: JobPlatform) {
	try {
		const videos = fs.readdirSync(`/tmp/${instanceId}/${platform}/video`);
		const publicVideoUrls = [];

		for (let video of videos) {
			const signedUrl = await uploadFileToAwsBucket(
				s3BucketService,
				`/tmp/${instanceId}/${platform}/video/${video}`,
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
