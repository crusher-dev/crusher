import { resoveWorkerPath } from "./utils/env";

require("dotenv").config();

import { Queue, QueueScheduler, Worker } from "bullmq";
import { REDIS } from "../config/database";
const IORedis = require("ioredis");
const path = require("path");

const redisClient = new IORedis({ host: REDIS.host, port: REDIS.port, password: REDIS.password });

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
		connection: redisClient,
	});
	new Queue("test-completed-queue", {
		connection: redisClient,
	});
	new Queue("check-result-queue", {
		connection: redisClient,
	});

	new Queue("video-processing-complete-queue", {
		connection: redisClient,
	});
}

function initializeWorkers() {
	console.debug("Initializing queue workers");

	new Worker("test-progress-queue", resoveWorkerPath(path.resolve("src/core/workers/testProgressWorker.ts")), {
		connection: redisClient,
		concurrency: 1,
	});
	new Worker("test-completed-queue", resoveWorkerPath(path.resolve("src/core/workers/testCompletedWorker.ts")), {
		connection: redisClient,
		concurrency: 1,
	});
	new Worker("check-result-queue", resoveWorkerPath(path.resolve("src/core/workers/checkResult.ts")), {
		connection: redisClient,
		concurrency: 1,
	});

	new Worker("video-processing-complete-queue", resoveWorkerPath(path.resolve("src/core/workers/videoProcessedQueue.ts")), {
		connection: redisClient,
		concurrency: 1,
	});
}

(async () => {
	const queueScheduler = new QueueScheduler("check-result-queue", {
		stalledInterval: 120000,
		maxStalledCount: 1,
		connection: redisClient,
	});
	await queueScheduler.waitUntilReady();
	initializeQueues();
	initializeWorkers();
})();
