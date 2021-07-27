import { generateUid } from "@shared/utils/helper";
import { RedisManager } from "@manager/redis";
RedisManager.initialize();

require("./queue.ts");
require("./util/logger");

class TestRunner {
	sessionId: string;
	redisManager: RedisManager;

	_registeredInstanceNo: number;

	constructor() {
		this.sessionId = generateUid();
	}

	async boot() {
		console.log("Test runner booted up");
	}
}

export { TestRunner };
