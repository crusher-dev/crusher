import { iTestRunnerJobOutput } from "../../../../crusher-shared/types/runner/jobRunRequestOutput";
import { Job, Queue } from "bullmq";
import TestsEventsWorker from "./testEventsWoker";
import { REDDIS } from "../../../config/database";
import * as IORedis from "ioredis";

module.exports = async (bullJob: Job) => {
	const data = bullJob.data as iTestRunnerJobOutput;
	return TestsEventsWorker.onTestProgress(new IORedis({ host: REDDIS.host, password: REDDIS.password, port: parseInt(REDDIS.port) }), bullJob.data);
};
