import VideoProcessorBootstrap from "@src/bootstrap";
import * as worker from "@worker/index";

import Timeout = NodeJS.Timeout;

class EnterpriseVideoProcessorBootstrap extends VideoProcessorBootstrap {
	constructor() {
		super();
	}

	async boot() {
		await this.queueManager.setupQueue("video-processing-queue");
		await this.queueManager.setupQueueScheduler("video-processing-queue", {
			stalledInterval: 120000,
			maxStalledCount: 1,
		});
		await this.queueManager.addWorkerForQueue("video-processing-queue", worker as any, {
			concurrency: 1,
		});

		console.log("Test runner booted up");
	}
}

export default EnterpriseVideoProcessorBootstrap;
