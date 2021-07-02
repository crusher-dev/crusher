import { resoveWorkerPath } from "./utils/env";

require("dotenv").config();

import { Queue, QueueScheduler, Worker } from "bullmq";
import { REDIS } from "../config/database";
import IORedis from "ioredis";
const path = require("path");

const connection = new IORedis({ host: REDIS.host, port: REDIS.port, password: REDIS.password });

if (process.env.NODE_ENV === "development") {
	// For ts-node
	require(resoveWorkerPath(path.resolve("src/core/workers/testProgressWorker.ts")));
	require(resoveWorkerPath(path.resolve("src/core/workers/testCompletedWorker.ts")));
	require(resoveWorkerPath(path.resolve("src/core/workers/checkResult.ts")));
	require(resoveWorkerPath(path.resolve("src/core/workers/videoProcessedQueue.ts")));
}

function initializeQueues() {
	console.debug("Initializing queues");
	new Queue("test-progress-queue", {
		connection: connection,
	});
	new Queue("test-completed-queue", {
		connection: connection,
	});
	new Queue("check-result-queue", {
		connection: connection,
	});

	new Queue("video-processing-complete-queue", {
		connection: connection,
	});
}

function initializeWorkers() {
	console.debug("Initializing queue workers");

	new Worker("test-progress-queue", resoveWorkerPath(path.resolve("src/core/workers/testProgressWorker.ts")), {
		connection: connection,
		concurrency: 1,
	});
	new Worker("test-completed-queue", resoveWorkerPath(path.resolve("src/core/workers/testCompletedWorker.ts")), {
		connection: connection,
		concurrency: 1,
	});
	new Worker("check-result-queue", resoveWorkerPath(path.resolve("src/core/workers/checkResult.ts")), {
		connection: connection,
		concurrency: 1,
	});

	new Worker("video-processing-complete-queue", resoveWorkerPath(path.resolve("src/core/workers/videoProcessedQueue.ts")), {
		connection: connection,
		concurrency: 1,
	});
}

(async () => {
	const queueScheduler = new QueueScheduler("check-result-queue", {
		stalledInterval: 120000,
		maxStalledCount: 1,
		connection: connection,
	});
	await queueScheduler.waitUntilReady();
	initializeQueues();
	initializeWorkers();
})();
