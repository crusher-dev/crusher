import { Worker, Queue, QueueScheduler } from "bullmq";
import * as path from "path";
import { RedisManager } from "@manager/redis";

const REQUEST_QUEUE = "request-queue";
const queue = new Queue(REQUEST_QUEUE, { connection: RedisManager.client as any });
// eslint-disable-next-line @typescript-eslint/no-var-requires
const workerModule = require("./worker").default;

queue.client.then(async (client) => {
	const queueScheduler = new QueueScheduler(REQUEST_QUEUE, {
		stalledInterval: 120000,
		maxStalledCount: 1,
		connection: client as any,
	});
	await queueScheduler.waitUntilReady();

	new Worker(REQUEST_QUEUE, workerModule, {
		concurrency: 1,
		connection: client,
		lockDuration: 120000,
	});
});
