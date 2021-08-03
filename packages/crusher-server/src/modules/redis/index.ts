import { Service } from "typedi";
import IORedis = require("ioredis");

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

@Service()
class RedisManager {
	redisClient: IORedis.Redis;

	constructor() {
		this.redisClient = new IORedis(getConnectionObject());
	}

	private getRedisExpiryModeType(highLevelType): "ex" | "px" {
		switch (highLevelType) {
			case "s":
				return "ex";
			case "ms":
				return "px";
			default:
				throw new Error("Invalid expiry type");
		}
	}

	isAlive(): boolean {
		return this.redisClient && this.redisClient.status === "ready";
	}

	get(keyName: string): Promise<string> {
		return this.redisClient.get(keyName);
	}

	set(keyName: string, value: string, options?: { expiry?: { type: "s" | "m" | "ms"; value: number } }): Promise<string> {
		if (options.expiry) return this.redisClient.set(keyName, value, this.getRedisExpiryModeType(options.expiry.type), options.expiry.value);

		return this.redisClient.set(keyName, value);
	}
}

export { RedisManager };
