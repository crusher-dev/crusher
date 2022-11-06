require("dotenv").config();

import { TEST_COMPLETE_QUEUE, TEST_EXECUTION_QUEUE, VIDEO_PROCESSOR_QUEUE } from "@crusher-shared/constants/queues";
import { QueueManager } from "@modules/queue";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import "reflect-metadata";
import Container from "typedi";

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

let _bootAfterNJobsOffset = Number.MAX_SAFE_INTEGER;
const TEST_PER_INSTANCE = 10;
let _lastJobPickedUpTime = Date.now();
let _registeredInstanceNo = undefined;

function getBootAfterNJobsOffset() {
	return _bootAfterNJobsOffset;
}

function setOffNodeOffset(instanceIndexKeys: number[]) {
	const orderedInstanceNo = instanceIndexKeys.sort().findIndex((key) => key === _registeredInstanceNo);
	_bootAfterNJobsOffset = orderedInstanceNo * TEST_PER_INSTANCE;
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
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		getOffset: process.env.CRUSHER_SCALE_LABMDA_URL ? getBootAfterNJobsOffset.bind(this) : undefined,
	});

	worker.on("active", (job) => {
		_lastJobPickedUpTime = Date.now();
	});

	setupInstanceHeartbeat(worker, queueManager.redisManager.redisClient);
	worker.on("error", (err) => {
		// log the error
		console.error(err);
	});

	console.log("Boot complete");
}

async function setupInstanceHeartbeat(worker, redisClient) {
	_registeredInstanceNo = await redisClient.incr("result_processor_instance_index");
	_lastJobPickedUpTime = Date.now();

	const sendHeartbeat = () => {
		const client = redisClient;
		return client
			.set(`result_processor_instance:${_registeredInstanceNo}`, _registeredInstanceNo, "ex", 60)
			.catch((err) => {
				console.error(`Failed to set heartbeat key for ${_registeredInstanceNo}`);
				console.error(err);
			})
			.then(() => client.keys("result_processor_instance:*"))
			.catch((err) => {
				console.error(`Failed to get all instance keys`);
				console.error(err);
			})
			.then((keys: string[]) => {
				const instanceIndexKeys = keys
					.map((key) => {
						return key.split(":")[1];
					})
					.map((key) => parseInt(key));
				setOffNodeOffset(instanceIndexKeys);
			});
	};

	sendHeartbeat();
	const _heartBeatInterval = setInterval(sendHeartbeat, 10000) as any;

	const shutDownInterval = setInterval(async () => {
		if (Date.now() - _lastJobPickedUpTime > 120000 && _bootAfterNJobsOffset != 0) {
			console.log("Shutting down...", Date.now(), _lastJobPickedUpTime, _bootAfterNJobsOffset);
			await worker.close();

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
						}
						return;
					});
			}
		} else {
			console.log("Processing size:", (worker as any).processing.size);
			console.log("Processing map:", (worker as any).processing);
			console.log("Time gap:", Date.now() - _lastJobPickedUpTime, _lastJobPickedUpTime);
			console.log("Worker offset:", _bootAfterNJobsOffset);
		}
	}, 60000);
}

boot();
