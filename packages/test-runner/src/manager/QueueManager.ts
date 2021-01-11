import { Worker, Queue, QueueScheduler } from 'bullmq';
import { REDDIS } from '../../config/database';
const path = require('path');
const codeRunnerWorker = require('../services/codeRunnerWorker');

const queue = new Queue('request-queue', { connection: REDDIS as any });

queue.client.then(async reddisClient => {
	const queueScheduler = new QueueScheduler('request-queue', {
		stalledInterval: 120000,
		maxStalledCount: 1,
		connection: reddisClient,
	});
	await queueScheduler.waitUntilReady();

	new Worker('request-queue', codeRunnerWorker);
});
