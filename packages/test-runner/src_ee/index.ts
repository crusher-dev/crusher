import { generateUid } from "@shared/utils/helper";
import Timeout = NodeJS.Timeout;
import { RedisManager } from "@manager/redis";
import { REDDIS } from "@config/database";
import { BootAfterNJobsOffsetManager } from "@manager/offsetManger";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("./queue.ts");
require("../src/util/logger");

const TEST_PER_INSTANCE = 5;

class TestRunner {
	sessionId: string;
	redisManager: RedisManager;

	_heartBeatInterval: Timeout;
	_registeredInstanceNo: number;

	constructor() {
		this.sessionId = generateUid();
		this.redisManager = new RedisManager(REDDIS.host, parseInt(REDDIS.port), REDDIS.password);
		// During booting, make sure test runner doesn't pickup any jobs without checking its bootAfterNJobsOffset
	}

	async setupInstanceHeartbeat() {
		/*
			Note - Check if this working correctly an
		 */
		this._registeredInstanceNo = await this.redisManager.get().incr("instance_index");

		const sendHeartbeat = () => {
			const client = this.redisManager.get();
			return client
				.set(`instance:${this._registeredInstanceNo}`, this._registeredInstanceNo, "ex", 60)
				.catch((err) => {
					console.error(`Failed to set heartbeat key for ${this._registeredInstanceNo}`);
					console.error(err);
				})
				.then(() => client.keys("instance:*"))
				.catch((err) => {
					console.error(`Failed to get all instance keys`);
					console.error(err);
				})
				.then((keys: string[]) => {
					const instanceIndexKeys = keys
						.map((key) => {
							return key.split(":")[1];
						})
						.map((key) => parseInt(key));
					this.setOffNodeOffset(instanceIndexKeys);
				});
		};

		this._heartBeatInterval = setInterval(sendHeartbeat, 2000) as any;
	}

	private setOffNodeOffset(instanceIndexKeys: number[]) {
		const orderedInstanceNo = instanceIndexKeys.sort().findIndex((key) => key === this._registeredInstanceNo);
		BootAfterNJobsOffsetManager.set(orderedInstanceNo * TEST_PER_INSTANCE);
	}

	async boot() {
		await this.setupInstanceHeartbeat();
		console.log("Test runner booted up");
	}
}

export { TestRunner };
