import * as shell from "shelljs";
import { getStorageManager } from "@utils/cache";
import { ensureFfmpegPath, processRemoteRawVideoAndSave } from "@utils/ffmpeg";
import { Job } from "bullmq";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

const storageManager = getStorageManager();

ensureFfmpegPath();

interface iVideoProcessorJob extends Job {
	data: {
		testInstanceId: string;
		videoRawUrl: string;
	};
}

export default async function (bullJob: iVideoProcessorJob){
	const { testInstanceId, videoRawUrl } = bullJob.data;
	console.log(`Processing video for ${bullJob.name}`, videoRawUrl);

	const savedVideoPath = await processRemoteRawVideoAndSave(videoRawUrl, path.join("/tmp/videos", testInstanceId + uuidv4()) + ".mp4");

	const uploadedVideoUrl = await storageManager.upload(savedVideoPath, path.join(bullJob.name, "videos/video.mp4"));

	await shell.rm("-rf", savedVideoPath);

	// @TODO: Make an api call and set featured_video_uri of this test instance
	console.log("Uploaded video url", uploadedVideoUrl);
};

