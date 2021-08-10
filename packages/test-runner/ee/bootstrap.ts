import TestRunnerBootstrap from "@src/boostrap";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";

import Timeout = NodeJS.Timeout;

class EnterpriseTestRunnerBootstrap extends TestRunnerBootstrap {
	sessionId: string;
	_heartBeatInterval: Timeout;
	_registeredInstanceNo: number;
	_bootAfterNJobsOffset: number;

	constructor() {
		super();

		this.sessionId = uuidv4();
		this._bootAfterNJobsOffset = Number.MAX_SAFE_INTEGER;
	}

	async boot() {
		this.setupInstanceHeartbeat();

		await this.queueManager.setupQueue("test-execution-queue");
		await this.queueManager.setupQueueScheduler("test-execution-queue", {
			stalledInterval: 120000,
			maxStalledCount: 1,
		});
		await this.queueManager.addWorkerForQueue("test-execution-queue", path.resolve(__dirname, "./worker.js"), {
			concurrency: 3,
			lockDuration: 120000,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			getOffset: BootAfterNJobsOffsetManager.get,
		});
		console.log("Booted up test runner...");
	}

	/*
		Note - Check if this working correctly an
	*/
	async setupInstanceHeartbeat() {
		this._registeredInstanceNo = await this.redisManager.client.incr("instance_index");

		const sendHeartbeat = () => {
			const client = this.redisManager.client;
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
		const TEST_PER_INSTANCE = 5;

		const orderedInstanceNo = instanceIndexKeys.sort().findIndex((key) => key === this._registeredInstanceNo);
		this._bootAfterNJobsOffset = orderedInstanceNo * TEST_PER_INSTANCE;
	}
}

export default EnterpriseTestRunnerBootstrap;
