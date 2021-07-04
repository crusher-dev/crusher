import { generateUid } from "@shared/utils/helper";
import { RedisManager } from "@manager/redis";
import { REDDIS } from "@config/database";
RedisManager.initialize(REDDIS.host, REDDIS.port, REDDIS.password);

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
