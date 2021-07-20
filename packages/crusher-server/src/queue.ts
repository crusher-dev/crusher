import { resolveWorkerPath } from "./utils/env";

require("dotenv").config();

import { Queue, QueueScheduler, Worker } from "bullmq";
import { REDIS } from "../config/database";
import { isOpenSourceEdition } from "./utils/helper";
import { RedisManager } from "@manager/redis";
import path = require("path");

RedisManager.initialize(REDIS.host, REDIS.port, REDIS.password);
const redisClient: any = RedisManager.get();
let testProgressWorker, testCompletedWorker, checkResultWorker, videoProcessedQueueWorker;

if (process.env.NODE_ENV === "development" || isOpenSourceEdition()) {
	// For ts-node
	testProgressWorker = require("./core/workers/testProgressWorker.ts");
	testCompletedWorker = require("./core/workers/testCompletedWorker.ts");
	checkResultWorker = require("./core/workers/checkResult.ts");
	videoProcessedQueueWorker = require("./core/workers/videoProcessedQueue.ts");
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

/*
	@Returns:
		worker as function import for open source edition,
		worker as absolute path for ee edition
*/
function getWorkerForCurrentEdition(workerPath: string) {
	return isOpenSourceEdition() ? require(workerPath) : resolveWorkerPath(workerPath);
}

function initializeWorkers() {
	console.debug("Initializing queue workers");

	new Worker("test-progress-queue", testProgressWorker ? testProgressWorker : getWorkerForCurrentEdition("src/core/workers/testProgressWorker.ts"), {
		connection: redisClient,
		concurrency: 1,
	});
	new Worker("test-completed-queue", testCompletedWorker ? testCompletedWorker : getWorkerForCurrentEdition("src/core/workers/testCompletedWorker.ts"), {
		connection: redisClient,
		concurrency: 1,
	});
	new Worker("check-result-queue", checkResultWorker ? checkResultWorker : getWorkerForCurrentEdition("src/core/workers/checkResult.ts"), {
		connection: redisClient,
		concurrency: 1,
	});

	new Worker(
		"video-processing-complete-queue",
		videoProcessedQueueWorker ? videoProcessedQueueWorker : getWorkerForCurrentEdition("src/core/workers/videoProcessedQueue.ts"),
		{
			connection: redisClient,
			concurrency: 1,
		},
	);
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
