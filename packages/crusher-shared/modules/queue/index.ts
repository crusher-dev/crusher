import { Worker, Processor, Queue, QueueScheduler, QueueSchedulerOptions, WorkerOptions, QueueOptions, FlowProducer } from "bullmq";
import { RedisManager } from "../redis";

class QueueManager {
	redisManager: RedisManager;
	queues: { [name: string]: { scheduler?: QueueScheduler | null; worker?: Worker | null; value?: Queue | null } };
	flowProducer: FlowProducer;

	constructor(redisManager: RedisManager) {
		this.redisManager = redisManager;
		this.queues = {};
	}

	getFlowProducer() {
		if (!this.flowProducer) {
			this.flowProducer = new FlowProducer({ connection: this.redisManager.redisClient as any });
		}

		return this.flowProducer;
	}

	async setupQueue(queueName: string, options: QueueOptions = {}): Promise<Queue> {
		const queueRecord = Object.prototype.hasOwnProperty.call(this.queues, queueName);
		if (queueRecord && queueRecord.value) {
			console.error(`${queueName} already initialized`);
			return queueRecord.value;
		}

		this.queues[queueName] = this.queues[queueName] ? this.queues[queueName] : {};
		this.queues[queueName] = {
			...this.queues[queueName],
			value: new Queue(queueName, { ...options, connection: this.redisManager.redisClient as any }),
		};

		await this.queues[queueName].value.waitUntilReady();

		return this.queues[queueName].value;
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

		this.queues[queueName] = this.queues[queueName] ? this.queues[queueName] : {};
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
