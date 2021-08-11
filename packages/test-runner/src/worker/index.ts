import { CodeRunnerService } from "./runner.service";
import { getQueueManager, getStorageManager } from "../util/cache";
import { Notifier } from "@modules/notifier/index";
import { createTmpAssetsDirectoriesIfNotThere, deleteTmpAssetsDirectoriesIfThere } from "@shared/utils/helper";

import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { Job } from "bullmq";
import { IJobRunRequest } from "@shared/types/runner/jobRunRequest";

const queueManager = getQueueManager();
const storageManager = getStorageManager();

interface iTestRunnerJob extends Job {
	data: IJobRunRequest;
}

export default async function (bullJob: iTestRunnerJob): Promise<boolean> {
	const identifier = bullJob.name;

	const testOutputProcessorQueue = await queueManager.setupQueue("test-output-processor-queue");
	const videoProcessorQueue = await queueManager.setupQueue("video-processor-queue");

	const notifyManager = new Notifier(bullJob.data.buildId, bullJob.data.testInstanceId, bullJob.data.githubCheckRunId);
	await notifyManager.logTest(ActionStatusEnum.STARTED, `Test ${identifier} started...`);

	createTmpAssetsDirectoriesIfNotThere(identifier);

	const codeRunnerService = new CodeRunnerService(bullJob.data.actions, bullJob.data.config, storageManager, notifyManager, identifier);

	const { recordedRawVideo, hasPassed, error, actionResults } = await codeRunnerService.runTest();

	if (recordedRawVideo) {
		await videoProcessorQueue.add(
			identifier,
			{ runnerJobRequestInfo: bullJob.data, video: recordedRawVideo },
			{ lifo: false, removeOnComplete: true, attempts: 1 },
		);
	}

	deleteTmpAssetsDirectoriesIfThere(identifier);

	if (!hasPassed) {
		await notifyManager.logTest(ActionStatusEnum.FAILED, `Test ${identifier} failed...`, { error: error.message });
	} else {
		await notifyManager.logTest(ActionStatusEnum.COMPLETED, `Test ${identifier} executed successfully...`, { actionResults });
	}

	// @TODO: Fix this paylaod
	await testOutputProcessorQueue.add(identifier, {
		runnerJobRequestInfo: bullJob.data,
	});

	return true;
}
