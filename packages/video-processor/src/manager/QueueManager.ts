import { Worker, Queue, QueueScheduler } from "bullmq";
import { RedisManager } from "./RedisManager";
RedisManager.initialize();

const path = require("path");
const r = require("@services/videoProcessorWorker");

const queue = new Queue("video-processing-queue", { connection: RedisManager.client as any });

queue.client.then(async (redisClient) => {
	const queueScheduler = new QueueScheduler("video-processing-queue", {
		stalledInterval: 120000,
		maxStalledCount: 1,
		connection: redisClient,
	});
	await queueScheduler.waitUntilReady();

	new Worker("video-processing-queue", path.resolve("src/services/videoProcessorWorker.ts"), {
		connection: redisClient,
	});
});
