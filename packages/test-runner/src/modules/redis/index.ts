import IORedis = require("ioredis");
import { RedisManager as ParentRedisManager } from "@shared/modules/redis";

// @TODO: This should come from where the class is initalized.
function getConnectionObject(): IORedis.RedisOptions {
	if (process.env.REDIS_CONNECTION_STRING) {
		return { path: process.env.REDIS_CONNECTION_STRING };
	}

	return {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : null,
		password: process.env.REDIS_PASSWORD,
	};
}

class RedisManager extends ParentRedisManager {
	constructor() {
		super(getConnectionObject());
	}
}

export { RedisManager };
