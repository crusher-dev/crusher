import { Worker, Queue, QueueScheduler } from "bullmq";
import { REDDIS } from "@config/database";
const path = require("path");
const r = require("@services/videoProcessorWorker");

const queue = new Queue("video-processing-queue", { connection: REDDIS });

queue.client.then(async (redisClient) => {
	const queueScheduler = new QueueScheduler("video-processing-queue", {
		stalledInterval: 120000,
		maxStalledCount: 1,
		connection: redisClient,
	});
	await queueScheduler.waitUntilReady();

	new Worker("video-processing-queue", path.resolve("src/services/videoProcessorWorker.ts"), {
		connection: redisClient,
		concurrency: 2,
	});
});
