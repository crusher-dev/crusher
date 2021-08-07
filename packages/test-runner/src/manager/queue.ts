import { Worker, Processor, Queue, QueueScheduler, QueueSchedulerOptions, WorkerOptions } from "bullmq";
import { RedisManager } from "./redis";

class QueueManager {
	redisManager: RedisManager;
	queues: { [name: string]: { scheduler?: QueueScheduler | null; worker?: Worker | null; value?: Queue | null } };

	constructor(redisManager: RedisManager) {
		this.redisManager = redisManager;
	}

	setupQueue(queueName: string): boolean {
		const queueRecord = Object.prototype.hasOwnProperty.call(this.queues, queueName);
		if (queueRecord && queueRecord.value) {
			console.error(`${queueName} already initialized`);
			return false;
		}

		this.queues[queueName] = this.queues[queueName] ? this.queues[queueName] : {};
		this.queues[queueName] = {
			...this.queues[queueName],
			value: new Queue(queueName, { connection: RedisManager.client as any }),
		};

		return true;
	}

	async setupQueueScheduler(queueName: string, options: Omit<QueueSchedulerOptions, "connection">): Promise<boolean> {
		const queueRecord = Object.prototype.hasOwnProperty.call(this.queues, queueName);
		if (queueRecord && queueRecord.scheduler) {
			console.error(`Scheduler for ${queueName} already initialized`);
			return false;
		}

		this.queues[queueName] = this.queues[queueName] ? this.queues[queueName] : {};
		this.queues[queueName] = {
			...this.queues[queueName],
			scheduler: new QueueScheduler(queueName, {
				...options,
				connection: RedisManager.client as any,
			}),
		};

		await this.queues[queueName].scheduler.waitUntilReady();

		return true;
	}

	async addWorkerForQueue(queueName: string, processor: string | Processor<any, any, string>, options: Omit<WorkerOptions, "connection"> = {}) {
		const queueRecord = Object.prototype.hasOwnProperty.call(this.queues, queueName);
		if (queueRecord && queueRecord.worker) {
			console.error(`Scheduler for ${queueName} already initialized`);
			return false;
		}

		this.queues[queueName] = this.queues[queueName] ? this.queues[queueName] : {};
		this.queues[queueName] = {
			...this.queues[queueName],
			worker: new Worker(queueName, processor, {
				...options,
				connection: RedisManager.client as any,
			}),
		};
	}
}

export { QueueManager };
