import { Worker, Queue, QueueScheduler } from 'bullmq';
import { REDDIS } from '../../config/database';
const path = require('path');
require('../services/codeRunnerWorker');

const queue = new Queue('request-queue', { connection: REDDIS as any });

queue.client.then(async (reddisClient) => {
	const queueScheduler = new QueueScheduler('request-queue', {
		stalledInterval: 120000,
		maxStalledCount: 1,
		connection: reddisClient,
	});
	await queueScheduler.waitUntilReady();

	new Worker('request-queue', path.resolve(path.resolve('src/services/codeRunnerWorker.ts')), {
		connection: reddisClient,
		concurrency: 3,
		lockDuration: 120000,
	});
});
