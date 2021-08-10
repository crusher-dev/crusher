import { QueueManager } from "@modules/queue";
import { RedisManager } from "@modules/redis";
import { setupStorage } from "./storage";

import { IStorageManager } from "@shared/lib/storage/interface";

let redisManager: RedisManager | null = null;

function getRedisManager(): RedisManager {
	if (!redisManager) redisManager = new RedisManager();
	return redisManager;
}

let queueManager: QueueManager | null = null;

function getQueueManager(): QueueManager {
	if (!queueManager) queueManager = new QueueManager(getRedisManager());

	return queueManager;
}

let storageManager: IStorageManager | null = null;

function getStorageManager(): IStorageManager {
	if (!storageManager) storageManager = setupStorage();
	return storageManager;
}

export { getRedisManager, getQueueManager, getStorageManager };
