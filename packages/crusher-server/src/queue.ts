require("dotenv").config();

import "reflect-metadata";
import { QueueManager } from "@modules/queue";
import Container from "typedi";
import { TEST_COMPLETE_QUEUE, TEST_EXECUTION_QUEUE, VIDEO_PROCESSOR_QUEUE } from "@crusher-shared/constants/queues";
import * as path from "path";
import * as fs from "fs";
import axios from "axios";

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

	let _lastJobPickedUpTime = Date.now();
	worker.on("active", (job) => {
		_lastJobPickedUpTime = Date.now();
	});

	const shutDownInterval = setInterval(async () => {
		if (Date.now() - _lastJobPickedUpTime > 120000 && !worker.isRunning()) {
			console.log("Shutting down...");
			worker.pause();

			if (process.env.ECS_ENABLE_CONTAINER_METADATA) {
				// Get the container metadata
				const containerMetadata = await axios.get<{ TaskARN: string }>(`${process.env.ECS_CONTAINER_METADATA_URI_V4}/task`);
				const taskId = containerMetadata.data.TaskARN;

				await axios
					.post<{ status: string }>(process.env.CRUSHER_SCALE_LABMDA_URL, { type: "shutDown.resultProcessor", payload: { taskId } })
					.then((res) => {
						const { status } = res.data;
						if (status === "success") {
							clearInterval(shutDownInterval);
							process.exit(0);
						} else {
							worker.resume();
						}
						return;
					})
					.catch((err) => {
						worker.resume();
					});
			}
		}
	}, 60000);

	worker.on("error", (err) => {
		// log the error
		console.error(err);
	});

	console.log("Boot complete");
}

boot();
