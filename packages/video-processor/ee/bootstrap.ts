import { VIDEO_PROCESSOR_QUEUE } from "@shared/constants/queues";
import VideoProcessorBootstrap from "@src/bootstrap";
import * as worker from "@worker/index";
import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Worker } from "bullmq";

import Timeout = NodeJS.Timeout;
const TEST_PER_INSTANCE = 7;

class EnterpriseVideoProcessorBootstrap extends VideoProcessorBootstrap {
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
		this._worker = await this.queueManager.addWorkerForQueue(VIDEO_PROCESSOR_QUEUE, workerPath, {
			concurrency: 4,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			getOffset: this.getBootAfterNJobsOffset.bind(this),
		});
		this._worker.on("active", (job) => {
			this._lastJobPickedUpTime = Date.now();
		});

		this.setupInstanceHeartbeat();

		const workerPath = fs.existsSync(path.resolve(__dirname, "./worker.js")) ? path.resolve(__dirname, "./worker.js") : path.resolve("src/worker/index.ts");

		await this.queueManager.setupQueue(VIDEO_PROCESSOR_QUEUE);
		await this.queueManager.setupQueueScheduler(VIDEO_PROCESSOR_QUEUE, {
			maxStalledCount: 1,
		});

		console.log("Video processor booted up");
	}

	/*
		Note - Check if this working correctly an
	*/
	async setupInstanceHeartbeat() {
		this._registeredInstanceNo = await this.redisManager.redisClient.incr("video_processor_instance_index");
		this._lastJobPickedUpTime = Date.now();

		const sendHeartbeat = () => {
			const client = this.redisManager.redisClient;
			return client
				.set(`video_processor_instance:${this._registeredInstanceNo}`, this._registeredInstanceNo, "ex", 60)
				.catch((err) => {
					console.error(`Failed to set heartbeat key for ${this._registeredInstanceNo}`);
					console.error(err);
				})
				.then(() => client.keys("video_processor_instance:*"))
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

		sendHeartbeat();
		this._heartBeatInterval = setInterval(sendHeartbeat, 10000) as any;

		const shutDownInterval = setInterval(async () => {
			if (Date.now() - this._lastJobPickedUpTime > 120000 && (this._worker as any).processing.size() === 0) {
				console.log("Shutting down...");
				await this._worker.pause();

				if (process.env.ECS_ENABLE_CONTAINER_METADATA) {
					// Get the container metadata
					const containerMetadata = await axios.get<{ TaskARN: string }>(`${process.env.ECS_CONTAINER_METADATA_URI_V4}/task`);
					const taskId = containerMetadata.data.TaskARN;

					await axios
						.post<{ status: string }>(process.env.CRUSHER_SCALE_LABMDA_URL, { type: "shutDown.videoProcessor", payload: { taskId } })
						.then((res) => {
							const { status } = res.data;
							if (status === "success") {
								clearInterval(shutDownInterval);
								process.exit(0);
							} else {
								this._worker.resume();
							}
							return;
						})
						.catch((err) => {
							this._worker.resume();
							console.error("Recieved error while shutting down", err);
						});
				}
			}
		}, 60000);
	}

	private setOffNodeOffset(instanceIndexKeys: number[]) {
		const orderedInstanceNo = instanceIndexKeys.sort().findIndex((key) => key === this._registeredInstanceNo);
		this._bootAfterNJobsOffset = orderedInstanceNo * TEST_PER_INSTANCE;
	}
}

export default EnterpriseVideoProcessorBootstrap;
