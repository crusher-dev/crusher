import { Worker, Queue, QueueScheduler } from "bullmq";
import * as path from "path";
import { RedisManager } from "@manager/redis";
import { REDDIS } from "@config/database";
import { getEdition } from "./util/helper";
import { EDITION_TYPE } from "@shared/types/common/general";

const REQUEST_QUEUE = "request-queue";
const queue = new Queue(REQUEST_QUEUE, { connection: RedisManager.client as any });

queue.client.then(async (client) => {
	const queueScheduler = new QueueScheduler(REQUEST_QUEUE, {
		stalledInterval: 120000,
		maxStalledCount: 1,
		connection: REDDIS,
	});
	await queueScheduler.waitUntilReady();

	const workerPath = process.env.NODE_ENV === "production" ? path.resolve(__dirname, "./worker.js") : path.resolve("src/worker.ts");

	new Worker(REQUEST_QUEUE, getEdition() === EDITION_TYPE.OPEN_SOURCE ? require(workerPath) : workerPath, {
		connection: RedisManager.client as any,
		lockDuration: 120000,
	});
});
