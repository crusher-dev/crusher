import { iJobRunRequest } from "@shared/types/runner/jobRunRequest";

const ffmpeg = require("fluent-ffmpeg");
import * as shell from "shelljs";
import { setupBucketManager, uploadFileToAwsBucket } from "@utils/cloudBucket";
import { ensureFfmpegPath } from "@utils/helper";
import { Job, Queue } from "bullmq";
import { REDDIS } from "@config/database";

const got = require("got");

const videoProcessingQueue = new Queue("video-processing-complete-queue", {
	connection: REDDIS as any,
});
function processStreamAndSave(videoUrl, savePath: string) {
	return new Promise((resolve, reject) => {
		const responseStream = got.stream(videoUrl);

		const ffmpegStream = ffmpeg({ source: responseStream, priority: 20 })
			.videoCodec("libx264")
			.inputFormat("image2pipe")
			.inputFPS(25)
			.outputOptions("-preset ultrafast")
			.outputOptions("-pix_fmt yuv420p")
			.on("error", function (err) {
				reject(err);
			})
			.on("end", function () {
				resolve(savePath);
			})
			.save(savePath);

		responseStream.on("error", (err) => {
			if (ffmpegStream.end) {
				ffmpegStream.end();
			}
			reject(err);
		});
	});
}

ensureFfmpegPath();

interface iVideoProcessorJob extends Job {
	data: {
		runnerJobRequestInfo: iJobRunRequest;
		video: string;
	};
}

// Create S3 service object
const fileStorageService = setupBucketManager();

module.exports = async (bullJob: iVideoProcessorJob) => {
	const { runnerJobRequestInfo, video } = bullJob.data;
	console.log(`Processing video for ${runnerJobRequestInfo.requestType}/${runnerJobRequestInfo.test.id}/${runnerJobRequestInfo.instanceId}`, video);
	if (video) {
		let signedUrl;
		try {
			await shell.mkdir("-p", `/tmp/videos/`);

			await processStreamAndSave(video, `/tmp/videos/${runnerJobRequestInfo.instanceId}.mp4`);

			signedUrl = await uploadFileToAwsBucket(
				fileStorageService,
				`/tmp/videos/${runnerJobRequestInfo.instanceId}.mp4`,
				`${runnerJobRequestInfo.instanceId}.mp4`,
				`${runnerJobRequestInfo.test.id}/${runnerJobRequestInfo.instanceId}/`,
			);

			await shell.rm("-rf", `/tmp/videos/${runnerJobRequestInfo.instanceId}.mp4`);
			await fileStorageService.remove(`${runnerJobRequestInfo.requestType}/${runnerJobRequestInfo.instanceId}/video.mp4.raw`);

			await videoProcessingQueue.add(runnerJobRequestInfo.test.id.toString(), {
				processed: true,
				recordedVideoUrl: signedUrl,
				instanceId: runnerJobRequestInfo.instanceId,
				testId: runnerJobRequestInfo.test.id,
				testType: runnerJobRequestInfo.requestType,
			});
			return true;
		} catch (ex) {
			console.log(ex);
			await videoProcessingQueue.add(runnerJobRequestInfo.test.id.toString(), {
				processed: signedUrl ? true : false,
				recordedVideoUrl: signedUrl,
				instanceId: runnerJobRequestInfo.instanceId,
				testId: runnerJobRequestInfo.test.id,
				testType: runnerJobRequestInfo.requestType,
			});
			return true;
		}
	} else {
		await videoProcessingQueue.add(runnerJobRequestInfo.test.id.toString(), {
			processed: false,
			recordedVideoUrl: null,
			instanceId: runnerJobRequestInfo.instanceId,
			testId: runnerJobRequestInfo.test.id,
			testType: runnerJobRequestInfo.requestType,
		});
		return true;
	}
};

require("../../utils/logger");
