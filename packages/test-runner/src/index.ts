import { generateUid } from "@shared/utils/helper";
import { RedisManager } from "@manager/redis";
import { REDDIS } from "@config/database";
require("./queue.ts");
require("./util/logger");

class TestRunner {
	sessionId: string;
	redisManager: RedisManager;

	_registeredInstanceNo: number;

	constructor() {
		this.sessionId = generateUid();
		this.redisManager = new RedisManager(REDDIS.host, parseInt(REDDIS.port), REDDIS.password);
	}

	async boot() {
		console.log("Test runner booted up");
	}
}

export { TestRunner };
