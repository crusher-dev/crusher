import { RedisManager } from "@modules/redis";
import { QueueManager } from "@modules/queue";
import * as worker from "./worker";
import { getQueueManager, getRedisManager } from "@util/cache";

class TestRunnerBootstrap {
	redisManager: RedisManager;
	queueManager: QueueManager;

	constructor() {
		this.redisManager = getRedisManager();
		this.queueManager = getQueueManager();
	}

	async boot() {
		await this.queueManager.setupQueue("test-execution-queue");
		await this.queueManager.setupQueueScheduler("test-execution-queue", {
			stalledInterval: 120000,
			maxStalledCount: 1,
		});
		await this.queueManager.addWorkerForQueue("test-execution-queue", worker as any, {
			concurrency: 1,
			lockDuration: 120000,
		});

		console.log("Test runner booted up");
	}
}

export default TestRunnerBootstrap;
