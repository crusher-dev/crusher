import TestRunnerBootstrap from "../src/bootstrap";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import * as fs from "fs";
import * as url from "url";

import { Worker } from "bullmq";

import Timeout = NodeJS.Timeout;
import { TEST_EXECUTION_QUEUE } from "@shared/constants/queues";
import axios from "axios";

const TEST_PER_INSTANCE = 3;
class EnterpriseTestRunnerBootstrap extends TestRunnerBootstrap {
	sessionId: string;
	_heartBeatInterval: Timeout;
	_registeredInstanceNo: number;
	_bootAfterNJobsOffset: number;

	_lastJobPickedUpTime: number;
	_worker: Worker;

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

		const queue = await this.queueManager.setupQueue(TEST_EXECUTION_QUEUE, {
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

		this._worker = await this.queueManager.addWorkerForQueue(TEST_EXECUTION_QUEUE, workerPath, {
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

		// Trigger everytime worker picks up job
		this._worker.on("active", (job) => {
			this._lastJobPickedUpTime = Date.now();
		});
		console.log("Booted up test runner...");
	}

	/*
		Note - Check if this working correctly an
	*/
	async setupInstanceHeartbeat() {
		this._registeredInstanceNo = await this.redisManager.redisClient.incr("instance_index");
		this._lastJobPickedUpTime = Date.now();

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


		const shutDownInterval = setInterval(async () => {
			if (Date.now() - this._lastJobPickedUpTime > 120000 && !this._worker.isRunning() ) {
				console.log("Shutting down...");
				this._worker.pause();

				if(process.env.ECS_ENABLE_CONTAINER_METADATA) {
					// Get the container metadata
					const containerMetadata = await axios.get<{"TaskARN": string}>(`${process.env.ECS_CONTAINER_METADATA_URI_V4}/task`);
					const taskId = containerMetadata.data.TaskARN;

					await axios.post<{status: string}>(process.env.CRUSHER_SCALE_LABMDA_URL, {type: "shutDown", payload: {taskId}}).then((res) => {
						const { status } = res.data;
						if(status === "success") {
							process.exit(0);
						} else {
							this._worker.resume();
						}
						return; 
					}).catch((err) => {
						this._worker.resume();
					})
				}				
			}
		}, 60000);
	}

	private setOffNodeOffset(instanceIndexKeys: number[]) {
		const orderedInstanceNo = instanceIndexKeys.sort().findIndex((key) => key === this._registeredInstanceNo);
		this._bootAfterNJobsOffset = orderedInstanceNo * TEST_PER_INSTANCE;
	}
}

export default EnterpriseTestRunnerBootstrap;
