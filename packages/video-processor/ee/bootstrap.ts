import { VIDEO_PROCESSOR_QUEUE } from "@shared/constants/queues";
import VideoProcessorBootstrap from "@src/bootstrap";
import * as worker from "@worker/index";

import Timeout = NodeJS.Timeout;

class EnterpriseVideoProcessorBootstrap extends VideoProcessorBootstrap {
	constructor() {
		super();
	}

	async boot() {
		await this.queueManager.setupQueue(VIDEO_PROCESSOR_QUEUE);
		await this.queueManager.setupQueueScheduler(VIDEO_PROCESSOR_QUEUE, {
			stalledInterval: 120000,
			maxStalledCount: 1,
		});
		await this.queueManager.addWorkerForQueue(VIDEO_PROCESSOR_QUEUE, worker.default as any, {
			concurrency: 1,
		});

		console.log("Video processor booted up");
	}
}

export default EnterpriseVideoProcessorBootstrap;
