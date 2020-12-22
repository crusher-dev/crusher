import { Queue, QueueEvents, QueueScheduler, Worker } from "bullmq";
import { REDDIS } from "../../../config/database";
import * as path from "path";
import TestsEventsWorker from "../workers/testEventsWoker";
import { VideoEventsPostProcessor } from "../workers/videoEventsPostProcessor";
const resultWorker = require("../workers/checkResult");

const checkResultQueue = new Queue("check-result-queue", {
	// @ts-ignore
	connection: REDDIS,
});

checkResultQueue.client.then(async (reddisClient) => {
	const queueScheduler = new QueueScheduler("check-result-queue", {
		stalledInterval: 120000,
		maxStalledCount: 1,
		connection: reddisClient,
	});
	await queueScheduler.waitUntilReady();

	new Worker(
		"check-result-queue",
		resultWorker,
		// @ts-ignore
		{ connection: reddisClient, concurrency: 1 },
	);

	// We can assume that only test-instance will be added to it
	// not draft instances.
	const requestQueueEvents = new QueueEvents("request-queue", {
		// @ts-ignore
		connection: reddisClient,
	});

	requestQueueEvents.on("progress", TestsEventsWorker.onTestProgress.bind(this, reddisClient));

	requestQueueEvents.on("completed", TestsEventsWorker.onTestCompleted.bind(this, reddisClient, checkResultQueue));
});

const videoProcessorEvents = new QueueEvents("video-processing-queue", {
	// @ts-ignore
	connection: REDDIS,
});

videoProcessorEvents.on("completed", VideoEventsPostProcessor.onVideoProcessed);
