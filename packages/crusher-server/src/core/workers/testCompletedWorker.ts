import { iTestRunnerJobOutput } from "../../../../crusher-shared/types/runner/jobRunRequestOutput";
import { Job, Queue } from "bullmq";
import TestsEventsWorker from "./testEventsWoker";
import { REDIS } from "../../../config/database";
const checkResultQueue = new Queue("check-result-queue", {
	// @ts-ignore
	connection: REDIS,
});

module.exports = async (bullJob: Job) => {
	const data = bullJob.data as iTestRunnerJobOutput;
	return TestsEventsWorker.onTestCompleted(checkResultQueue, data);
};
