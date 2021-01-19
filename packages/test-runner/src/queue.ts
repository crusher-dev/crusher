import { Worker, Queue, QueueScheduler } from 'bullmq';
import { REDDIS } from '../config/database';
import { BootAfterNJobsOffsetManager } from './manager/offsetManger';
import * as path from 'path';

const REQUEST_QUEUE = 'request-queue';
const queue = new Queue(REQUEST_QUEUE, { connection: REDDIS as any });

queue.client.then(async (client) => {
	const queueScheduler = new QueueScheduler(REQUEST_QUEUE, {
		stalledInterval: 120000,
		maxStalledCount: 1,
		connection: client,
	});
	await queueScheduler.waitUntilReady();

	new Worker(REQUEST_QUEUE, path.resolve('src/worker.ts'), {
		connection: client,
		concurrency: 5,
		lockDuration: 120000,
		//@ts-ignore
		getOffset: BootAfterNJobsOffsetManager.get,
	});
});
