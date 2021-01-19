import { Job, Queue } from 'bullmq';
import { iJobRunRequest } from '../../crusher-shared/types/runner/jobRunRequest';
import { createTmpAssetsDirectoriesIfNotThere, deleteTmpAssetsDirectoriesIfThere, uploadOutputToS3 } from './util/helper';
import { TestLogsService } from './services/logs';
import { CodeRunnerService } from './services/runner';
import { iTestRunnerJobOutput } from '../../crusher-shared/types/runner/jobRunRequestOutput';
import { ACTIONS_IN_TEST } from '../../crusher-shared/constants/recordedActions';
import { REDDIS } from '../config/database';
import { MongoManager } from './manager/mongo';

const videoProcessingQueue = new Queue('video-processing-queue', {
	connection: REDDIS as any,
});

interface iTestRunnerJob extends Job {
	data: iJobRunRequest;
}

new MongoManager().init();

module.exports = async (bullJob: iTestRunnerJob): Promise<iTestRunnerJobOutput> => {
	let testError, testOutput;
	createTmpAssetsDirectoriesIfNotThere(bullJob.data);
	const { requestType, instanceId } = bullJob.data;

	try {
		console.log(`[${requestType}/${instanceId}] Picked up test from the queue`);

		const testLogsService = new TestLogsService(bullJob.data);

		if (typeof bullJob.progress === 'function') {
			await bullJob.progress(bullJob.data);
		}

		testLogsService.notifyTestRunning().then(() => {
			console.log(`[${requestType}/${instanceId}] Successfully notified test is running`);
		});

		const logSteps = (actionType: ACTIONS_IN_TEST, body: string, meta: any, timeTakenForThisStep: number) => {
			console.log(`[${requestType}/${instanceId}] Action ${actionType} completed successfully`);
			return testLogsService.notifyLivelog(actionType, body, meta, timeTakenForThisStep, bullJob.data);
		};

		const { output, error } = await CodeRunnerService.runTest(bullJob.data, logSteps);

		const { signedImageUrls, signedRawVideoUrl } = await uploadOutputToS3(output, bullJob.data);

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
		console.error(`[${requestType}/${instanceId}] Error occurred during test execution`, testError);
	} else {
		console.log(`[${requestType}/${instanceId}] Test completed successfully`);
	}
	return {
		runnerJobRequestInfo: bullJob.data,
		output: testOutput,
		error: testError,
	};
};
