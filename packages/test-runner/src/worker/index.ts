import { CodeRunnerService } from "./runner.service";
import { getGlobalManager, getQueueManager, getRedisManager, getStorageManager } from "../util/cache";
import { Notifier } from "@modules/notifier/index";
import { createTmpAssetsDirectoriesIfNotThere, deleteTmpAssetsDirectoriesIfThere } from "@shared/utils/helper";

import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { Job } from "bullmq";
import { TEST_COMPLETE_QUEUE, VIDEO_PROCESSOR_QUEUE } from "@shared/constants/queues";
import { ITestExecutionQueuePayload, ITestCompleteQueuePayload, IVideoProcessorQueuePayload } from "@shared/types/queues/";
import { ExportsManager } from "@shared/lib/exports";
import {
	createTempContextDir,
	deleteDirIfThere,
	downloadUsingAxiosAndUnzip,
	getTempContextDirPath,
	TEMP_PERSISTENT_CONTEXTS_DIR,
	zipDirectory,
} from "@src/util/helper";
import * as path from "path";
interface iTestRunnerJob extends Job {
	data: ITestExecutionQueuePayload;
}

const queueManager = getQueueManager();
const storageManager = getStorageManager();

const TEST_RESULT_KEY = "TEST_RESULT";

module.exports = async function (bullJob: iTestRunnerJob): Promise<any> {
	try {
		const identifier = bullJob.name;

		const testCompleteQueue = await queueManager.setupQueue(TEST_COMPLETE_QUEUE);
		const videoProcessorQueue = await queueManager.setupQueue(VIDEO_PROCESSOR_QUEUE);
		const globalManager = getGlobalManager(true);
		const exportsManager = new ExportsManager(bullJob.data.exports ? bullJob.data.exports : []);
		const persistentContextDir = bullJob.data.startingPersistentContext ? getTempContextDirPath() : createTempContextDir();

		if (!globalManager.has(TEST_RESULT_KEY)) {
			globalManager.set(TEST_RESULT_KEY, []);
		}

		const notifyManager = new Notifier(bullJob.data.buildId, bullJob.data.testInstanceId);
		await notifyManager.logTest(ActionStatusEnum.STARTED, `Test ${identifier} started...`);

		createTmpAssetsDirectoriesIfNotThere(identifier);
		if (bullJob.data.startingPersistentContext) {
			console.log(
				await downloadUsingAxiosAndUnzip(await storageManager.getUrl(bullJob.data.startingPersistentContext), persistentContextDir + ".zip"),
				persistentContextDir,
			);
		}

		const codeRunnerService = new CodeRunnerService(
			bullJob.data.actions,
			bullJob.data.config,
			storageManager,
			notifyManager,
			globalManager,
			exportsManager,
			identifier,
			persistentContextDir,
		);
		const { recordedRawVideo, hasPassed, error, actionResults, persistenContextZipURL } = await codeRunnerService.runTest();
		if (recordedRawVideo) {
			console.log("Adding video in processing queue", recordedRawVideo);
			await videoProcessorQueue.add(
				identifier,
				{ testInstanceId: bullJob.data.testInstanceId, buildId: bullJob.data.buildId, videoRawUrl: recordedRawVideo } as IVideoProcessorQueuePayload,
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

		// Cleanup persistent context dir after test execution
		deleteDirIfThere(persistentContextDir);

		const parentJob = await Job.fromId(queueManager.queues[TEST_COMPLETE_QUEUE].value, bullJob.opts.parent.id);
		await parentJob.update({
			...parentJob.data,
			exports: exportsManager.getEntriesArr(),
			nextTestDependencies: bullJob.data.nextTestDependencies,
			actionResults: actionResults,
			buildId: bullJob.data.buildId,
			buildExecutionPayload: bullJob.data,
			testInstanceId: bullJob.data.testInstanceId,
			buildTestCount: bullJob.data.buildTestCount,
			hasPassed: hasPassed,
			failedReason: error ? error : null,
			storageState: globalManager.get("storageState"),
			persistenContextZipURL: persistenContextZipURL,
		} as ITestCompleteQueuePayload);
	} catch (err) {
		console.error(err);
	}
	return {};
};
