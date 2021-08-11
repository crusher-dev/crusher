import { RedisManager } from "@modules/redis";
import { QueueManager } from "@shared/modules/queue";
import * as worker from "@worker/index";
import { getQueueManager, getRedisManager } from "@utils/cache";

class VideoProcessorBootstrap {
	redisManager: RedisManager;
	queueManager: QueueManager;

	constructor() {
		this.redisManager = getRedisManager();
		this.queueManager = getQueueManager();
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

export default VideoProcessorBootstrap;
