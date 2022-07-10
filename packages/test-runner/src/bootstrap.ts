import { RedisManager } from "@modules/redis";
import { QueueManager } from "@shared/modules/queue";
import * as worker from "./worker";
import { getQueueManager, getRedisManager } from "@util/cache";
import { TEST_COMPLETE_QUEUE, TEST_EXECUTION_QUEUE, VIDEO_PROCESSOR_QUEUE } from "@shared/constants/queues";

// require("./util/logger");

class TestRunnerBootstrap {
	redisManager: RedisManager;
	queueManager: QueueManager;

	constructor() {
		this.redisManager = getRedisManager();
		this.queueManager = getQueueManager();
	}

	async boot() {
		await this.queueManager.setupQueue(TEST_EXECUTION_QUEUE, {
			limiter: {
				max: 2,
				duration: 1800000,
				groupKey: "buildId",
			} as any,
		});
		await this.queueManager.setupQueue(TEST_COMPLETE_QUEUE);
		await this.queueManager.setupQueue(VIDEO_PROCESSOR_QUEUE);
		await this.queueManager.setupQueueScheduler(TEST_EXECUTION_QUEUE, {
			stalledInterval: 120000,
			maxStalledCount: 1,
		});
		await this.queueManager.addWorkerForQueue(TEST_EXECUTION_QUEUE, worker as any, {
			concurrency: 1,
			limiter: {
				max: 2,
				duration: 1800000,
				groupKey: "buildId",
			},
		});

		console.log("Test runner booted up");
	}
}

export default TestRunnerBootstrap;
