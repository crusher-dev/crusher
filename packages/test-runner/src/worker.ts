import { Job, Queue } from "bullmq";
import { IJobRunRequest, iJobRunRequest } from "@shared/types/runner/jobRunRequest";
import { createTmpAssetsDirectoriesIfNotThere, deleteTmpAssetsDirectoriesIfThere, uploadOutputImageToS3, uploadOutputVideoToS3 } from "./util/helper";
import { NotifyService } from "./services/notify";
import { CodeRunnerService } from "./services/runner";
import { ACTIONS_IN_TEST } from "@shared/constants/recordedActions";
import { getQueueManager, getRedisManager } from "./cacheDeps";

const queueManager = getQueueManager();

interface iTestRunnerJob extends Job {
	data: IJobRunRequest;
}

export default async function (bullJob: iTestRunnerJob): Promise<boolean> {
	const testOutputProcessorQueue = await queueManager.setupQueue("test-output-processor-queue");
	const videoProcessorQueue = await queueManager.setupQueue("video-processor-queue");

	let testError, testOutput;
	createTmpAssetsDirectoriesIfNotThere(bullJob.data);
	const { requestType, instanceId } = bullJob.data;

	try {
		const notifyService = new NotifyService(bullJob.data.job.id, bullJob.data.instanceId, bullJob.data.job.check_run_id);
		await notifyService.notifyTestAddedToQueue();

		const signedImageUrls = [];
		const handleScreenshotImageBuffer = async (buffer: Buffer, screenshotName: string): Promise<string> => {
			const cloudImageUrl = await uploadOutputImageToS3({ name: screenshotName, value: buffer }, bullJob.data);
			signedImageUrls.push(cloudImageUrl);

			return cloudImageUrl;
		};

		const { output, error } = await CodeRunnerService.runTest(bullJob.data, notifyService.logStep.bind(this), handleScreenshotImageBuffer);

		const signedRawVideoUrl = await uploadOutputVideoToS3(output.video, bullJob.data);

		if (signedRawVideoUrl) {
			// Send the raw video dump to be processed by video-processor
			await videoProcessorQueue.add(
				(instanceId as number).toString(),
				{ runnerJobRequestInfo: bullJob.data, video: signedRawVideoUrl },
				{ lifo: false, removeOnComplete: true, attempts: 1 },
			);
		}

		testOutput = {
			signedImageUrls,
		};
		testError = error;
	} catch (err) {
		testError = err;
	}

	deleteTmpAssetsDirectoriesIfThere(bullJob.data);

	if (testError) {
		console.error(`[${requestType}/${instanceId}] Error occurred during test execution:`, testError);
	} else {
		console.log(`[${requestType}/${instanceId}] Test completed successfully`);
	}

	await testOutputProcessorQueue.add(instanceId.toString(), {
		runnerJobRequestInfo: bullJob.data,
		output: testOutput,
		error: testError,
	});

	return true;
};
