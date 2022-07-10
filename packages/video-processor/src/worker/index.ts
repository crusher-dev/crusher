import { setupLogger } from "@crusher-shared/modules/logger";
setupLogger("video-processor");
import * as shell from "shelljs";
import * as url from "url";
import { getStorageManager } from "@utils/cache";
import { ensureFfmpegPath, processAndSaveLastXSecondsClip, processRemoteRawVideoAndSave } from "@utils/ffmpeg";
import { Job } from "bullmq";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { IVideoProcessorQueuePayload } from "@shared/types/queues/";
import fetch from "node-fetch";

const storageManager = getStorageManager();

ensureFfmpegPath();

interface iVideoProcessorJob extends Job {
	data: IVideoProcessorQueuePayload;
}

function getRequestUrl(relativeUrl: string) {
	return url.resolve(process.env.BACKEND_URL, relativeUrl);
}

export default async function (bullJob: iVideoProcessorJob) {
	const { testInstanceId, buildId, videoRawUrl } = bullJob.data;
	console.log(`Processing video for ${bullJob.name}`, videoRawUrl);
	await shell.mkdir("-p", path.join("/tmp/videos"));

	try {
		const videoName = testInstanceId + uuidv4();

		const savedVideoPath = await processRemoteRawVideoAndSave(await storageManager.getUrl(videoRawUrl), path.join("/tmp/videos", videoName) + ".mp4");

		const uploadedVideoUrl = await storageManager.upload(savedVideoPath, path.join("00_folder_7_day_expiration/", bullJob.name, "videos/video.mp4"));

		const lastSecondsClipName = videoName + "_clipped";

		const lastSecondsClipPath = await processAndSaveLastXSecondsClip(
			path.join("/tmp/videos", videoName) + ".mp4",
			path.join("/tmp/videos", lastSecondsClipName + "_clipped") + ".mp4",
			5,
		);

		const uploadedLastSecondsClipVideoUrl = await storageManager.upload(
			lastSecondsClipPath,
			path.join("00_folder_7_day_expiration/", bullJob.name, "videos/video_clipped.mp4"),
		);
		await storageManager.remove(`00_temp_folder/${buildId}/${testInstanceId}/video.mp4.raw`);

		await shell.rm("-rf", savedVideoPath);
		await shell.rm("-rf", lastSecondsClipPath);

		console.log("Sending request to this", getRequestUrl(`builds/${buildId}/instances/${testInstanceId}/action.addRecordedVideo`));
		// @TODO: Make an api call and set featured_video_uri of this test instance
		await fetch(getRequestUrl(`builds/${buildId}/instances/${testInstanceId}/action.addRecordedVideo`), {
			method: "POST",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				recordedVideoUrl: uploadedVideoUrl,
				lastSecondsClipVideoUrl: uploadedLastSecondsClipVideoUrl,
			}),
		});
		console.log("Uploaded video url and clip url", uploadedVideoUrl, uploadedLastSecondsClipVideoUrl);
		return true;
	} catch (err) {
		return false;
	}
}
