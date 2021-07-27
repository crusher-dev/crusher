import { Job } from "bullmq";
import TestsEventsWorker from "./testEventsWoker";
import { RedisManager } from "@manager/redis";
import { REDIS } from "../../../config/database";
RedisManager.initialize();

module.exports = async (bullJob: Job) => {
	console.log("GOT JOB");
	const data = bullJob as any;
	await TestsEventsWorker.onTestProgress(RedisManager.get(), data);
	return true;
};
