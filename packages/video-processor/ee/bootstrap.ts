import { VIDEO_PROCESSOR_QUEUE } from "@shared/constants/queues";
import VideoProcessorBootstrap from "@src/bootstrap";
import * as worker from "@worker/index";
import * as fs from "fs";
import * as path from "path";

import Timeout = NodeJS.Timeout;

class EnterpriseVideoProcessorBootstrap extends VideoProcessorBootstrap {
	constructor() {
		super();
	}

	async boot() {
		const workerPath = fs.existsSync(path.resolve(__dirname, "./worker.js")) ? path.resolve(__dirname, "./worker.js") : path.resolve("src/worker/index.ts");

		await this.queueManager.setupQueue(VIDEO_PROCESSOR_QUEUE);
		await this.queueManager.setupQueueScheduler(VIDEO_PROCESSOR_QUEUE, {
			maxStalledCount: 1,
		});
		await this.queueManager.addWorkerForQueue(VIDEO_PROCESSOR_QUEUE, workerPath, {
			concurrency: 4,
		});

		console.log("Video processor booted up");
	}
}

export default EnterpriseVideoProcessorBootstrap;
