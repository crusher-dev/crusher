import * as shell from 'shelljs';
import { iJobRunRequest } from '../../../crusher-shared/types/runner/jobRunRequest';
import * as fs from 'fs';
import path from 'path';
import { CloudBucketManager } from '../manager/cloudBucket';

export const createTmpAssetsDirectoriesIfNotThere = (jobRequest: iJobRunRequest) => {
	shell.mkdir('-p', `/tmp/crusher/${jobRequest.requestType}/${jobRequest.test.id}/${jobRequest.instanceId}/images`);
	shell.mkdir('-p', `/tmp/crusher/${jobRequest.requestType}/${jobRequest.test.id}/${jobRequest.instanceId}/videos`);
};

export const deleteTmpAssetsDirectoriesIfThere = (jobRequest: iJobRunRequest) => {
	shell.rm('-rf', `/tmp/crusher/${jobRequest.requestType}/${jobRequest.test.id}/${jobRequest.instanceId}/images`);
	shell.rm('-rf', `/tmp/crusher/${jobRequest.requestType}/${jobRequest.test.id}/${jobRequest.instanceId}/videos`);
};

export const replaceImportWithRequire = (code: string) => {
	const matchImportRegex = new RegExp(/import(\s+\S+\s+)from\s+(\S+);/gm);

	return code.replace(matchImportRegex, function (match, variableName, packageName) {
		if (!variableName || !packageName) {
			return match;
		}
		return `const ${variableName} = require(${packageName});`;
	});
};

export const getAllCapturedImages = (jobRequest: iJobRunRequest): { [imageName: string]: string } => {
	const imageDirPath = `/tmp/crusher/${jobRequest.requestType}/${jobRequest.test.id}/${jobRequest.instanceId}/images`;
	const images = fs.readdirSync(imageDirPath);

	return images.reduce((prev, current) => {
		return { ...prev, [current]: path.resolve(imageDirPath, current) };
	}, {});
};

export const getAllCapturedVideos = (jobRequest: iJobRunRequest): { [videoName: string]: string } => {
	const videoDirPath = `/tmp/crusher/${jobRequest.requestType}/${jobRequest.test.id}/${jobRequest.instanceId}/videos`;
	const videos = fs.readdirSync(videoDirPath);

	return videos.reduce((prev, current) => {
		return { ...prev, [current]: path.resolve(videoDirPath, current) };
	}, {});
};

const bucketManager = new CloudBucketManager({ useLocalStack: process.env.NODE_ENV === 'production' ? false : true });

export const uploadOutputToS3 = async (bufferImages: Array<{ name: string; value: Buffer }>, video: string | null, jobRequest: iJobRunRequest) => {
	const targetDir = `${jobRequest.requestType}/${jobRequest.instanceId}`;

	let signedRawVideoUrl = null;
	if (video) {
		signedRawVideoUrl = await bucketManager.upload(video, path.resolve(targetDir, `/video.mp4.raw`));
	}
	const signedImages = [];
	for (let imageBufferInfo of bufferImages) {
		signedImages.push(await bucketManager.uploadBuffer(imageBufferInfo.value, path.resolve(targetDir, imageBufferInfo.name)));
	}

	return { signedImageUrls: signedImages, signedRawVideoUrl };
};
