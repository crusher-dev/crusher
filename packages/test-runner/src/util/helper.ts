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

export const createTmpAssetsDirectoriesIfNotThere = (identifer: string) => {
	shell.mkdir("-p", path.join("/tmp/crusher", identifer, "videos"));
};

export const deleteTmpAssetsDirectoriesIfThere = (identifer: string) => {
	shell.rm("-rf", path.join("/tmp/crusher", identifer));
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

export const bucketManager = setupBucketManager();

export const uploadOutputVideoToS3 = async (video: string | null, jobRequest: iJobRunRequest) => {
	if (!video) return null;

	const targetDir = `${jobRequest.requestType}/${jobRequest.instanceId}`;

	return bucketManager.upload(video, path.join(targetDir, `/video.mp4.raw`));
};

export const uploadOutputImageToS3 = async (imageBufferInfo: { name: string; value: Buffer }, jobRequest: iJobRunRequest): Promise<string> => {
	const targetDir = `${jobRequest.requestType}/${jobRequest.instanceId}`;
	return bucketManager.uploadBuffer(imageBufferInfo.value, path.join(targetDir, imageBufferInfo.name));
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
