import IORedis, { Redis } from "ioredis";

export class RedisManager {
	client: Redis;

	constructor(host: string, port: number, password: string) {
		this.client = new IORedis({ host, port, password });
		console.log(`Connected to ${host}:${port}`);
	}

	get() {
		return this.client;
	}
}
