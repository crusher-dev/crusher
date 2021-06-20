import { Job } from "bullmq";
import TestsEventsWorker from "./testEventsWoker";
import { REDDIS } from "../../../config/database";
import * as IORedis from "ioredis";

module.exports = async (bullJob: Job) => {
	console.log("GOT JOB");
	const data = bullJob as any;
	await TestsEventsWorker.onTestProgress(
		new IORedis({
			host: REDDIS.host,
			password: REDDIS.password,
			port: parseInt(REDDIS.port),
		}),
		data,
	);
	return true;
};
