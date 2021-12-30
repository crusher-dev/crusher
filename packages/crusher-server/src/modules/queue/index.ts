import { QueueManager as BaseQueueManager } from "@crusher-shared/modules/queue";
import { RedisManager } from "@modules/redis";
import Container, { Service } from "typedi";

@Service()
class QueueManager extends BaseQueueManager {
	constructor() {
		const redisManager = Container.get(RedisManager);
		super(redisManager);
	}
}

export { QueueManager };
