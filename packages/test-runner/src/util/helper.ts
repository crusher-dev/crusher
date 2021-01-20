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

export const uploadOutputToS3 = async (output: { images: { [name: string]: string }; video?: string }, jobRequest: iJobRunRequest) => {
	const targetDir = `${jobRequest.requestType}/${jobRequest.instanceId}`;

	let signedRawVideoUrl = null;
	if (output.video) {
		signedRawVideoUrl = await bucketManager.upload(output.video, path.resolve(targetDir, `/video.mp4.raw`));
	}
	const signedImages = [];
	const imagesKeys = Object.keys(output.images);
	for (let imageKey of imagesKeys) {
		signedImages.push(await bucketManager.upload(output.images[imageKey], path.resolve(targetDir, imageKey)));
	}

	return { signedImageUrls: signedImages, signedRawVideoUrl };
};
