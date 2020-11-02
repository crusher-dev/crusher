// @ts-ignore
import fs from 'fs';
import { Bucket, Storage } from '@google-cloud/storage';
import { CLOUD_API_CREDENTIALS, CLOUD_PROJECT_ID } from '../../../config/google_cloud';
import { Logger } from '../../utils/logger';

const TESTS_BUCKET_NAME = 'crusher-tests';

const storage: Storage = new Storage({
	projectId: CLOUD_PROJECT_ID,
	credentials: CLOUD_API_CREDENTIALS,
});

const testImagesBucket = storage.bucket(TESTS_BUCKET_NAME);

export async function uploadFileToBucket(
	bucket: Bucket,
	filePath: string,
	fileName: string,
	destination: string = '/',
) {
	await bucket.upload(filePath, {
		destination: destination + '/' + fileName,
		gzip: true,
		metadata: {
			cacheControl: 'public, max-age=31536000',
		},
	});

	Logger.info('cloudBucket::uploadFileToBucket', `${filePath} uploaded to ${bucket.name} bucket.`);
}

export async function uploadImageToBucket(filePath: string, destination: string) {
	try {
		const imageName: string = filePath.split('/').slice(-1)[0];
		await uploadFileToBucket(testImagesBucket, filePath, imageName, destination);
		const file = testImagesBucket.file(destination + '/' + imageName);
		const signedUrls = await file.getSignedUrl({
			action: 'read',
			expires: '03-09-2491',
		});
		if (signedUrls && signedUrls.length) {
			return signedUrls[0];
		} else {
			return false;
		}
	} catch (err) {
		return err;
	}
}
