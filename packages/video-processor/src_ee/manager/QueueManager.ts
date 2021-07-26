import { Worker, Queue, QueueScheduler } from "bullmq";
import { REDDIS } from "@config/database";
import { RedisManager } from "../../src/manager/RedisManager";

const path = require("path");
const r = require("@services/videoProcessorWorker");
RedisManager.initialize();

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
		concurrency: 2,
	});
});
