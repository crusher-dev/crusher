import { RedisManager } from "@modules/redis";
import { QueueManager } from "@shared/modules/queue";
import * as worker from "@worker/index";
import { getQueueManager, getRedisManager } from "@utils/cache";
import { VIDEO_PROCESSOR_QUEUE } from "@shared/constants/queues";
class VideoProcessorBootstrap {
	redisManager: RedisManager;
	queueManager: QueueManager;

	constructor() {
		this.redisManager = getRedisManager();
		this.queueManager = getQueueManager();
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

export default VideoProcessorBootstrap;
