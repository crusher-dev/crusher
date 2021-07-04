import IORedis, { Redis } from "ioredis";

export class RedisManager {
	static client: Redis;

	static initialize(host: string, port: number, password: string) {
		if(!RedisManager.client) {
			RedisManager.client = new IORedis({ host, port, password });
			console.log(`Connected to ${host}:${port}`);
		} else {
			console.error(`Already connected to redis...`);
		}
	}

	static get() {
		return RedisManager.client;
	}
}
