import * as shell from "shelljs";
import { getStorageManager } from "@utils/cache";
import { ensureFfmpegPath, processRemoteRawVideoAndSave } from "@utils/ffmpeg";
import { Job } from "bullmq";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { IVideoProcessorQueuePayload } from "@shared/types/queues/";

const storageManager = getStorageManager();

ensureFfmpegPath();

interface iVideoProcessorJob extends Job {
	data: IVideoProcessorQueuePayload;
}

export default async function (bullJob: iVideoProcessorJob) {
	const { testInstanceId, buildId, videoRawUrl } = bullJob.data;
	console.log(`Processing video for ${bullJob.name}`, videoRawUrl);

	try {
		const savedVideoPath = await processRemoteRawVideoAndSave(videoRawUrl, path.join("/tmp/videos", testInstanceId + uuidv4()) + ".mp4");

		const uploadedVideoUrl = await storageManager.upload(savedVideoPath, path.join(bullJob.name, "videos/video.mp4"));

		await shell.rm("-rf", savedVideoPath);

		// @TODO: Make an api call and set featured_video_uri of this test instance
		await fetch(`http://localhost:8000/builds/${buildId}/instances/${testInstanceId}/action.addRecordedVideo`, {
			method: "POST",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				recordedVideoUrl: uploadedVideoUrl,
			}),
		});
		console.log("Uploaded video url", uploadedVideoUrl);
	} catch (err) {
		console.error(err);
	}
}
