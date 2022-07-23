import IORedis = require("ioredis");

class RedisManager {
	redisClient: IORedis.Redis;

	constructor(connectionObject: IORedis.RedisOptions) {
		this.redisClient = new IORedis({ ...connectionObject, maxRetriesPerRequest: null, enableReadyCheck: false });
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

	incr(keyName: string) {
		return this.redisClient.incr(keyName);
	}
}

export { RedisManager };
