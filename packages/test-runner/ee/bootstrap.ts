import TestRunnerBootstrap from "../src/bootstrap";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import * as fs from "fs";

import Timeout = NodeJS.Timeout;
import { TEST_EXECUTION_QUEUE } from "@shared/constants/queues";

const TEST_PER_INSTANCE = 3;
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

	private getBootAfterNJobsOffset() {
		return this._bootAfterNJobsOffset;
	}

	async boot() {
		this.setupInstanceHeartbeat();

		await this.queueManager.setupQueue(TEST_EXECUTION_QUEUE, {
			limiter: {
				max: 2,
    			duration: 1800000,
				groupKey: "buildId"
			} as any
		});
		await this.queueManager.setupQueueScheduler(TEST_EXECUTION_QUEUE, {
			stalledInterval: 180000,
			maxStalledCount: 1,
		});

		const workerPath = fs.existsSync(path.resolve(__dirname, "./worker.js")) ? path.resolve(__dirname, "./worker.js") : path.resolve("src/worker/index.ts");

		await this.queueManager.addWorkerForQueue(TEST_EXECUTION_QUEUE, workerPath, {
			concurrency: TEST_PER_INSTANCE,
			lockDuration: 120000,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			getOffset: this.getBootAfterNJobsOffset.bind(this),
			limiter: {
				max: 2,
    			duration: 1800000,
				groupKey: 'buildId'
			}
		});
		console.log("Booted up test runner...");
	}

	/*
		Note - Check if this working correctly an
	*/
	async setupInstanceHeartbeat() {
		this._registeredInstanceNo = await this.redisManager.redisClient.incr("instance_index");

		const sendHeartbeat = () => {
			const client = this.redisManager.redisClient;
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
		this._bootAfterNJobsOffset = orderedInstanceNo * TEST_PER_INSTANCE;
	}
}

export default EnterpriseTestRunnerBootstrap;
