require("dotenv").config();

import "reflect-metadata";
import { QueueManager } from "@modules/queue";
import Container from "typedi";
import { TEST_COMPLETE_QUEUE, TEST_EXECUTION_QUEUE, VIDEO_PROCESSOR_QUEUE } from "@crusher-shared/constants/queues";
import * as testCompleteWorker from "@modules/runner/workers/testCompleteWorker";

const queueManager = Container.get(QueueManager);

async function boot() {

	await queueManager.setupQueue(TEST_EXECUTION_QUEUE, {
		limiter: {
			max: 2,
			duration: 1800000,
			groupKey: "buildId",
		} as any,
	});
	await queueManager.setupQueue(TEST_COMPLETE_QUEUE);
	await queueManager.setupQueue(VIDEO_PROCESSOR_QUEUE);

	await queueManager.addWorkerForQueue(TEST_COMPLETE_QUEUE, testCompleteWorker.default as any, {
		concurrency: 1,
		lockDuration: 120000,
	});
}

boot();
