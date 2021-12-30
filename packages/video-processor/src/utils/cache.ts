import { QueueManager } from "@shared/modules/queue";
import { RedisManager } from "@modules/redis";
import { setupStorage } from "@shared/utils/storage";

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

const STORAGE_MODE = process.env.STORAGE_MODE;
const STORAGE_PORT = parseInt(process.env.STORAGE_PORT, 10);
const BASE_STORAGE_FOLDER = process.env.BASE_STORAGE_FOLDER;

function getStorageManager(): IStorageManager {
	if (!storageManager) storageManager = setupStorage(process.env.STORAGE_MODE as any, STORAGE_PORT, process.env.BASE_STORAGE_FOLDER);
	return storageManager;
}

export { getRedisManager, getQueueManager, getStorageManager };
