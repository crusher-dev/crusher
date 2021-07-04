import { Worker, Queue, QueueScheduler } from "bullmq";
import * as path from "path";
import { RedisManager } from "@manager/redis";

const REQUEST_QUEUE = "request-queue";
const queue = new Queue(REQUEST_QUEUE, { client: RedisManager.client });

queue.client.then(async (client) => {
	const queueScheduler = new QueueScheduler(REQUEST_QUEUE, {
		stalledInterval: 120000,
		maxStalledCount: 1,
		connection: client,
	});
	await queueScheduler.waitUntilReady();

	const workerPath = process.env.NODE_ENV === "production" ? path.resolve(__dirname, "./worker.js") : path.resolve("src/worker.ts");

	new Worker(REQUEST_QUEUE, workerPath, {
		client: RedisManager.client,
		lockDuration: 120000,
	});
});
