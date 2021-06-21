import { Job, Queue } from "bullmq";
import { iJobRunRequest } from "@shared/types/runner/jobRunRequest";
import { createTmpAssetsDirectoriesIfNotThere, deleteTmpAssetsDirectoriesIfThere, uploadOutputToS3 } from "./util/helper";
import { TestLogsService } from "./services/logs";
import { CodeRunnerService } from "./services/runner";
import { ACTIONS_IN_TEST } from "@shared/constants/recordedActions";
import { REDDIS } from "@config/database";
import { MongoManager } from "@manager/mongo";

const videoProcessingQueue = new Queue("video-processing-queue", {
	connection: REDDIS as any,
});

interface iTestRunnerJob extends Job {
	data: iJobRunRequest;
}

new MongoManager().init();

const testProgressQueue = new Queue("test-progress-queue", {
	// @ts-ignore
	connection: REDDIS,
});

const testCompletedQueue = new Queue("test-completed-queue", {
	// @ts-ignore
	connection: REDDIS,
});

export default async (bullJob: iTestRunnerJob): Promise<boolean> => {
	let testError, testOutput;
	createTmpAssetsDirectoriesIfNotThere(bullJob.data);
	const { requestType, instanceId } = bullJob.data;

	try {
		console.log(`[${requestType}/${instanceId}] Picked up test from the queue`);

		const testLogsService = new TestLogsService(bullJob.data);

		await testProgressQueue.add(instanceId.toString(), bullJob.data);

		testLogsService.notifyTestRunning().then(() => {
			console.log(`[${requestType}/${instanceId}] Successfully notified test is running`);
		});

		const logSteps = (actionType: ACTIONS_IN_TEST, body: string, meta: any, timeTakenForThisStep: number) => {
			console.log(`[${requestType}/${instanceId}] Action ${actionType} completed successfully`);
			return testLogsService.notifyLivelog(actionType, body, meta, timeTakenForThisStep, bullJob.data);
		};

		const bufferImages = [];
		const handleScreenshotImageBuffer = (buffer: Buffer, screenshotName: string) => {
			bufferImages.push({ name: screenshotName, value: buffer });
		};

		const { output, error } = await CodeRunnerService.runTest(bullJob.data, logSteps, handleScreenshotImageBuffer);

		/*
			@TODO -  Improve this to continuously stream buffer to remote object.
			Why - Consider you have 4 gb machine, browser is using 2 GB memory. With buffer space the memory will be
			less available, this should be making things slow.
		 */
		const { signedImageUrls, signedRawVideoUrl } = await uploadOutputToS3(bufferImages, output.video, bullJob.data);

		if (signedRawVideoUrl) {
			// Send the raw video dump to be processed by video-processor
			await videoProcessingQueue.add(
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

	await testCompletedQueue.add(instanceId.toString(), {
		runnerJobRequestInfo: bullJob.data,
		output: testOutput,
		error: testError,
	});

	return true;
};
