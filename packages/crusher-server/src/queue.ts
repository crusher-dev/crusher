require("dotenv").config();

import "reflect-metadata";
import { QueueManager } from "@modules/queue";
import Container from "typedi";
import { TEST_COMPLETE_QUEUE, TEST_EXECUTION_QUEUE, VIDEO_PROCESSOR_QUEUE } from "@crusher-shared/constants/queues";
import * as path from "path";
import * as fs from "fs";

const queueManager = Container.get(QueueManager);

let testCompleteWorker;

if (process.env.NODE_ENV === "development") {
	// For ts-node
	testCompleteWorker = require("./modules/runner/workers/testCompleteWorker.ts");
}

function getTestCompleteWoker() {
	const compiledWorkerPath = path.resolve(__dirname, "./src/modules/runner/workers/testCompleteWorker.ts.js");

	if (!fs.existsSync(compiledWorkerPath)) {
		// @Note: Disabling parallelism here using require for ts-node
		return testCompleteWorker.default;
	} else {
		return compiledWorkerPath;
	}
}

async function boot() {
	await queueManager.setupQueue(TEST_EXECUTION_QUEUE, {
		limiter: {
			max: 2,
			duration: 1800000,
			groupKey: "buildId",
		} as any,
	});
	await queueManager.setupQueue(TEST_COMPLETE_QUEUE);
	await queueManager.setupQueue(VIDEO_PROCESSOR_QUEUE);

	const worker = await queueManager.addWorkerForQueue(TEST_COMPLETE_QUEUE, getTestCompleteWoker(), {
		concurrency: 3,
		lockDuration: 120000,
	});

	console.log("Test complete work", testCompleteWorker);

	worker.on("error", (err) => {
		// log the error
		console.error(err);
	});

	console.log("Boot complete");
}

boot();
