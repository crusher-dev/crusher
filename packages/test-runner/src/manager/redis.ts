import IORedis, { Redis } from "ioredis";

export class RedisManager {
	static client: Redis;

	static initialize(host: string, port: number, password: string) {
		RedisManager.client = new IORedis({ host, port, password });
		console.log(`Connected to ${host}:${port}`);
	}

	static get() {
		return RedisManager.client;
	}
}
