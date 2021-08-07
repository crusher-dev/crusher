import { QueueManager } from "@modules/queue";
import { RedisManager } from "@modules/redis";

let redisManager = null;

function getRedisManager(): RedisManager {
	if (!redisManager) redisManager = new RedisManager();
	return redisManager;
}

let queueManager = null;
function getQueueManager(): QueueManager {
	if (!queueManager) queueManager = new QueueManager(getRedisManager());

	return queueManager;
}

export { getRedisManager, getQueueManager };
