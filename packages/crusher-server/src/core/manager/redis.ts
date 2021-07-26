import { REDIS } from "../../../config/database";

import { Redis } from "ioredis";
import IORedis = require("ioredis");
export class RedisManager {
	static client: Redis;

	static initialize() {
		if (!RedisManager.client) {
			const connectionObject = REDIS.connectionString ? REDIS.connectionString : { host: REDIS.host, port: REDIS.port || null, password: REDIS.password };
			RedisManager.client = new IORedis(connectionObject as any);
			console.log(`Connected to ${this.client.options.host}, ${this.client.options.port}`);
		} else {
			console.error(`Already connected to redis...`);
		}
	}

	static get() {
		return RedisManager.client;
	}
}
