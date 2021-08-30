require("dotenv").config();

import "reflect-metadata";
import { QueueManager } from "@modules/queue";
import Container from "typedi";
import { TEST_COMPLETE_QUEUE, TEST_EXECUTION_QUEUE, VIDEO_PROCESSOR_QUEUE } from "@crusher-shared/constants/queues";
import * as testCompleteWorker from "@modules/runner/workers/testCompleteWorker";
import { MongoManager } from "@modules/db/mongo";

const queueManager = Container.get(QueueManager);
const mongoManager = Container.get(MongoManager);

async function boot() {
	await mongoManager.waitUntilAlive();

	await queueManager.setupQueue(TEST_EXECUTION_QUEUE);
	await queueManager.setupQueue(TEST_COMPLETE_QUEUE);
	await queueManager.setupQueue(VIDEO_PROCESSOR_QUEUE);

	await queueManager.addWorkerForQueue(TEST_COMPLETE_QUEUE, testCompleteWorker.default as any, {
		concurrency: 3,
		lockDuration: 120000,
	});
}

boot();
