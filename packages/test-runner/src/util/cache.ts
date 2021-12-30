import { QueueManager } from "@shared/modules/queue";
import { RedisManager } from "@modules/redis";
import { setupStorage } from "@shared/utils/storage";
import { GlobalManager } from "@shared/lib/globals";

import { IStorageManager } from "@shared/lib/storage/interface";
import { IGlobalManager } from "@shared/lib/globals/interface";

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

const STORAGE_PORT = parseInt(process.env.STORAGE_PORT, 10);

function getStorageManager(): IStorageManager {
	if (!storageManager) storageManager = setupStorage(process.env.STORAGE_MODE as any, STORAGE_PORT, process.env.BASE_STORAGE_FOLDER);
	return storageManager;
}

let globalManager: IGlobalManager | null = null;

function getGlobalManager(forceInit: boolean): IGlobalManager {
	if (!globalManager || forceInit) globalManager = new GlobalManager();

	return globalManager;
}

export { getRedisManager, getQueueManager, getStorageManager, getGlobalManager };
