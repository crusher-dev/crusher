import * as shell from "shelljs";
import { iJobRunRequest } from "@shared/types/runner/jobRunRequest";
import * as fs from "fs";
import path from "path";
import { LocalFileStorage } from "@shared/lib/storage";
import { AwsCloudStorage } from "@shared/lib/storage/aws";
import { iAction } from "@shared/types/action";
import { ACTIONS_IN_TEST } from "@shared/constants/recordedActions";
import { EDITION_TYPE } from "@shared/types/common/general";

export function getEdition() {
	return process.env.CRUSHER_MODE;
}

export const createTmpAssetsDirectoriesIfNotThere = (jobRequest: iJobRunRequest) => {
	shell.mkdir("-p", `/tmp/crusher/${jobRequest.requestType}/${jobRequest.test.id}/${jobRequest.instanceId}/images`);
	shell.mkdir("-p", `/tmp/crusher/${jobRequest.requestType}/${jobRequest.test.id}/${jobRequest.instanceId}/videos`);
};

export const deleteTmpAssetsDirectoriesIfThere = (jobRequest: iJobRunRequest) => {
	shell.rm("-rf", `/tmp/crusher/${jobRequest.requestType}/${jobRequest.test.id}/${jobRequest.instanceId}/images`);
	shell.rm("-rf", `/tmp/crusher/${jobRequest.requestType}/${jobRequest.test.id}/${jobRequest.instanceId}/videos`);
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

const setupBucketManager = () => {
	if (process.env.STORAGE_MODE === "local") {
		const storagePort = parseInt(process.env.STORAGE_PORT, 10);

		return new LocalFileStorage({
			port: storagePort,
			bucketName: "crusher-videos",
			baseFolder: process.env.BASE_STORAGE_FOLDER,
		});
	}

	return new AwsCloudStorage({
		bucketName: "crusher-videos",
		bucketRegion: "us-east-1",
	});
};

const bucketManager = setupBucketManager();

export const uploadOutputToS3 = async (bufferImages: Array<{ name: string; value: Buffer }>, video: string | null, jobRequest: iJobRunRequest) => {
	const targetDir = `${jobRequest.requestType}/${jobRequest.instanceId}`;

	let signedRawVideoUrl = null;
	if (video) {
		signedRawVideoUrl = await bucketManager.upload(video, path.join(targetDir, `/video.mp4.raw`));
	}
	const signedImages = [];
	for (const imageBufferInfo of bufferImages) {
		signedImages.push(await bucketManager.uploadBuffer(imageBufferInfo.value, path.join(targetDir, imageBufferInfo.name)));
	}

	return { signedImageUrls: signedImages, signedRawVideoUrl };
};

export const getBaseUrlFromEvents = (actions: Array<iAction>): URL => {
	const startingNavigateAction = actions.find((action) => action.type === ACTIONS_IN_TEST.NAVIGATE_URL);
	if (!startingNavigateAction || !startingNavigateAction.payload.meta.value) return null;

	const startingNavigateUrl = startingNavigateAction.payload.meta.value;

	return new URL(startingNavigateUrl);
};

export const replaceBaseUrlInEvents = (startingUrl: URL, newHost: URL, actions: Array<iAction>): Array<iAction> => {
	return actions.map((action) => {
		if (action.type !== ACTIONS_IN_TEST.NAVIGATE_URL) return action;

		const currentActionURL = new URL(action.payload.meta.value);

		if (currentActionURL.origin !== startingUrl.origin) return action;

		currentActionURL.protocol = newHost.protocol;
		currentActionURL.host = newHost.host;
		action.payload.meta.value = currentActionURL.toString();
		return action;
	});
};
