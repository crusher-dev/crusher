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
		client: redisClient,
	});
	new Queue("test-completed-queue", {
		client: redisClient,
	});
	new Queue("check-result-queue", {
		client: redisClient,
	});

	new Queue("video-processing-complete-queue", {
		client: redisClient,
	});
}

function initializeWorkers() {
	console.debug("Initializing queue workers");

	new Worker("test-progress-queue", resoveWorkerPath(path.resolve("src/core/workers/testProgressWorker.ts")), {
		client: redisClient,
		concurrency: 1,
	});
	new Worker("test-completed-queue", resoveWorkerPath(path.resolve("src/core/workers/testCompletedWorker.ts")), {
		client: redisClient,
		concurrency: 1,
	});
	new Worker("check-result-queue", resoveWorkerPath(path.resolve("src/core/workers/checkResult.ts")), {
		client: redisClient,
		concurrency: 1,
	});

	new Worker("video-processing-complete-queue", resoveWorkerPath(path.resolve("src/core/workers/videoProcessedQueue.ts")), {
		client: redisClient,
		concurrency: 1,
	});
}

(async () => {
	const queueScheduler = new QueueScheduler("check-result-queue", {
		stalledInterval: 120000,
		maxStalledCount: 1,
		connection: REDIS,
	});
	await queueScheduler.waitUntilReady();
	initializeQueues();
	initializeWorkers();
})();
