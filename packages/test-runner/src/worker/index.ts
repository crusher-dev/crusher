import { CodeRunnerService } from "./runner.service";
import { getGlobalManager, getQueueManager, getRedisManager, getStorageManager } from "../util/cache";
import { Notifier } from "@modules/notifier/index";
import { createTmpAssetsDirectoriesIfNotThere, deleteTmpAssetsDirectoriesIfThere } from "@shared/utils/helper";

import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { Job } from "bullmq";
import { TEST_COMPLETE_QUEUE, VIDEO_PROCESSOR_QUEUE } from "@shared/constants/queues";
import { ITestExecutionQueuePayload, ITestCompleteQueuePayload, IVideoProcessorQueuePayload } from "@shared/types/queues/";
interface iTestRunnerJob extends Job {
	data: ITestExecutionQueuePayload;
}

const queueManager = getQueueManager();
const storageManager = getStorageManager();

const TEST_RESULT_KEY = "TEST_RESULT";

export default async function (bullJob: iTestRunnerJob): Promise<boolean> {
	const identifier = bullJob.name;

	const testCompleteQueue = await queueManager.setupQueue(TEST_COMPLETE_QUEUE);
	const videoProcessorQueue = await queueManager.setupQueue(VIDEO_PROCESSOR_QUEUE);
	const globalManager = getGlobalManager();

	if (!globalManager.has(TEST_RESULT_KEY)) {
		globalManager.set(TEST_RESULT_KEY, []);
	}

	const notifyManager = new Notifier(bullJob.data.buildId, bullJob.data.testInstanceId);
	await notifyManager.logTest(ActionStatusEnum.STARTED, `Test ${identifier} started...`);

	createTmpAssetsDirectoriesIfNotThere(identifier);

	const codeRunnerService = new CodeRunnerService(bullJob.data.actions, bullJob.data.config, storageManager, notifyManager, globalManager, identifier);
	const { recordedRawVideo, hasPassed, error, actionResults } = await codeRunnerService.runTest();

	if (recordedRawVideo) {
		await videoProcessorQueue.add(
			identifier,
			{ testInstanceId: bullJob.data.testInstanceId, videoRawUrl: recordedRawVideo } as IVideoProcessorQueuePayload,
			{
				lifo: false,
				removeOnComplete: true,
				attempts: 1,
			},
		);
	}

	deleteTmpAssetsDirectoriesIfThere(identifier);

	if (!hasPassed) {
		await notifyManager.logTest(ActionStatusEnum.FAILED, `Test ${identifier} failed...`, { error: error.message });
	} else {
		await notifyManager.logTest(ActionStatusEnum.COMPLETED, `Test ${identifier} executed successfully...`, { actionResults });
	}

	// @TODO: Fix this paylaod
	await testCompleteQueue.add(identifier, {
		actionResults: actionResults,
		buildId: bullJob.data.buildId,
		testInstanceId: bullJob.data.testInstanceId,
		buildTestCount: bullJob.data.buildTestCount,
		hasPassed: hasPassed,
		failedReason: error ? error : null,
	} as ITestCompleteQueuePayload);

	return true;
}
