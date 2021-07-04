import { Job } from "bullmq";
import TestsEventsWorker from "./testEventsWoker";
import { REDIS } from "../../../config/database";
import * as IORedis from "ioredis";

module.exports = async (bullJob: Job) => {
	console.log("GOT JOB");
	const data = bullJob as any;
	await TestsEventsWorker.onTestProgress(
		new IORedis({
			host: REDIS.host,
			password: REDIS.password,
			port: REDIS.port,
		}),
		data,
	);
	return true;
};
