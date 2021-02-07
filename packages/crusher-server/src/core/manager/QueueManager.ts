import { Queue, QueueEvents, QueueScheduler, Worker } from "bullmq";
import { REDDIS } from "../../../config/database";
const resultWorker = require("../workers/checkResult");
const testCompletedWorker = require("../workers/testCompletedWorker");
const testProgressWorker = require("../workers/testProgressWorker");
const videoProcessedWorker = require("../workers/videoProcessedQueue");

const checkResultQueue = new Queue("check-result-queue", {
	// @ts-ignore
	connection: REDDIS,
});

const testProgressQueue = new Queue("test-progress-queue", {
	// @ts-ignore
	connection: REDDIS,
});

const testCompletedQueue = new Queue("test-completed-queue", {
	// @ts-ignore
	connection: REDDIS,
});

const videoProcessingCompleteQueue = new Queue("video-processing-complete-queue", {
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

	new Worker(
		"test-completed-queue",
		testCompletedWorker,
		// @ts-ignore
		{ connection: reddisClient, concurrency: 1 },
	);

	console.log("ADDING WORKER FOR VIDEO PROCESSING COMPLETE QUEUE");
	new Worker(
		"video-processing-complete-queue",
		videoProcessedWorker,
		// @ts-ignore
		{ connection: reddisClient, concurrency: 1 },
	);
});

const videoProcessorEvents = new QueueEvents("video-processing-queue", {
	// @ts-ignore
	connection: REDDIS,
});
