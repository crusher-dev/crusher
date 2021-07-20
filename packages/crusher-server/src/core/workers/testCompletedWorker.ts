import { iTestRunnerJobOutput } from "../../../../crusher-shared/types/runner/jobRunRequestOutput";
import { Job, Queue } from "bullmq";
import TestsEventsWorker from "./testEventsWoker";
import { RedisManager } from "@manager/redis";
import { REDIS } from "../../../config/database";
RedisManager.initialize(REDIS.host, REDIS.port, REDIS.password);

const checkResultQueue = new Queue("check-result-queue", {
	connection: RedisManager.get() as any,
});

module.exports = async (bullJob: Job) => {
	const data = bullJob.data as iTestRunnerJobOutput;
	return TestsEventsWorker.onTestCompleted(checkResultQueue, data);
};
