require("dotenv").config();

import { Queue, QueueScheduler, Worker } from "bullmq";
import { REDDIS } from "../config/database";
import * as path from "path";

function initializeQueues() {
	console.debug("Initializing queues");
	new Queue("test-progress-queue", {
		connection: REDDIS as any,
	});
	new Queue("test-completed-queue", {
		connection: REDDIS as any,
	});
	new Queue("check-result-queue", {
		connection: REDDIS as any,
	});

	new Queue("video-processing-complete-queue", {
		connection: REDDIS as any,
	});
}

function initializeWorkers() {
	console.debug("Initializing queue workers");

	new Worker("test-progress-queue", path.resolve("src/core/workers/testProgressWorker.ts"), { connection: REDDIS as any, concurrency: 1 });
	new Worker("test-completed-queue", path.resolve("src/core/workers/testCompletedWorker.ts"), { connection: REDDIS as any, concurrency: 1 });
	new Worker("check-result-queue", path.resolve("src/core/workers/checkResult.ts"), { connection: REDDIS as any, concurrency: 1 });

	new Worker("video-processing-complete-queue", path.resolve("src/core/workers/videoProcessedQueue.ts"), { connection: REDDIS as any, concurrency: 1 });
}

(async () => {
	const queueScheduler = new QueueScheduler("check-result-queue", {
		stalledInterval: 120000,
		maxStalledCount: 1,
		connection: REDDIS as any,
	});
	await queueScheduler.waitUntilReady();
	initializeQueues();
	initializeWorkers();
})();
