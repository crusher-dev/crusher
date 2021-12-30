import { Worker, Processor, Queue, QueueScheduler, QueueSchedulerOptions, WorkerOptions, QueueOptions } from "bullmq";
import { RedisManager } from "../redis";

class QueueManager {
	redisManager: RedisManager;
	queues: { [name: string]: { scheduler?: QueueScheduler | null; worker?: Worker | null; value?: Queue | null } };

	constructor(redisManager: RedisManager) {
		this.redisManager = redisManager;
		this.queues = {};
	}

	async setupQueue(queueName: string, options: QueueOptions = {}): Promise<Queue> {
		const queueRecord = Object.prototype.hasOwnProperty.call(this.queues, queueName);
		if (queueRecord?.value) {
			console.error(`${queueName} already initialized`);
			return queueRecord.value;
		}

		if (!this.queues[queueName]) this.queues[queueName] = {};
		this.queues[queueName] = {
			...this.queues[queueName],
			value: new Queue(queueName, { ...options, connection: this.redisManager.redisClient as any }),
		};

		await this.queues[queueName].value.waitUntilReady();

		return this.queues[queueName].value;
	}

	async setupQueueScheduler(queueName: string, options: Omit<QueueSchedulerOptions, "connection">): Promise<boolean> {
		const queueRecord = Object.prototype.hasOwnProperty.call(this.queues, queueName);
		if (queueRecord?.scheduler) {
			console.error(`Scheduler for ${queueName} already initialized`);
			return false;
		}

		if (!this.queues[queueName]) this.queues[queueName] = {};
		this.queues[queueName] = {
			...this.queues[queueName],
			scheduler: new QueueScheduler(queueName, {
				...options,
				connection: this.redisManager.redisClient as any,
			}),
		};

		await this.queues[queueName].scheduler.waitUntilReady();

		return true;
	}

	async addWorkerForQueue(queueName: string, processor: string | Processor<any, any, string>, options: Omit<WorkerOptions, "connection"> = {}): Promise<any> {
		const queueRecord = Object.prototype.hasOwnProperty.call(this.queues, queueName);
		if (queueRecord && this.queues[queueName].worker) {
			console.error(`Scheduler for ${queueName} already initialized`);
			return this.queues[queueName].worker;
		}

		if (!this.queues[queueName]) this.queues[queueName] = {};
		this.queues[queueName] = {
			...this.queues[queueName],
			worker: new Worker(queueName, processor, {
				...options,
				connection: this.redisManager.redisClient as any,
			}),
		};

		await this.queues[queueName].worker.waitUntilReady();
		return this.queues[queueName].worker;
	}
}

export { QueueManager };
