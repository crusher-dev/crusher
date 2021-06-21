import { TestsLogs } from "../models/testLogs";
import { RUNNER_REQUEST_TYPE } from "@shared/types/runner/requestType";
import { iJobRunRequest } from "@shared/types/runner/jobRunRequest";
import { TestLiveStepsLogs } from "@models/testLiveStepsLogs";
import { ACTIONS_IN_TEST } from "@shared/constants/recordedActions";

export const TEST_LOGS_SERVICE_TAGS = {
	TEST_ADDED_TO_QUEUE: "TEST_ADDED_TO_QUEUE",
	TEST_RUNNING: "TEST_RUNNING",
	TEST_EXECUTION_FAILED: "TEST_EXECUTION_FAILED",
	TEST_EXECUTION_COMPLETED: "TEST_EXECUTION_COMPLETED",
};

export class TestLogsService {
	jobRequest: iJobRunRequest;

	constructor(jobRequest: iJobRunRequest) {
		this.jobRequest = jobRequest;
	}

	notifyLivelog(actionType: ACTIONS_IN_TEST, body: string, meta: any, timeTakenForThisStep: number, jobRequest: iJobRunRequest) {
		return new TestLiveStepsLogs({
			actionType: actionType,
			body: body,
			testId: jobRequest.test.id,
			testType: jobRequest.requestType,
			meta: {
				...(meta ? meta : {}),
				timeTaken: timeTakenForThisStep,
			},
		}).save();
	}

	notify(tag: string, message: string, meta?: any) {
		return new TestsLogs({
			tag: TEST_LOGS_SERVICE_TAGS.TEST_ADDED_TO_QUEUE,
			message,
			jobId: this.jobRequest.job ? this.jobRequest.job.id : null,
			testId: this.jobRequest.test.id,
			instanceId: this.jobRequest.instanceId,
			type: this.jobRequest.requestType,
			meta: meta,
		}).save();
	}

	async notifyTestAddedToQueue() {
		const message =
			this.jobRequest.requestType === RUNNER_REQUEST_TYPE.DRAFT
				? `Instance #${this.jobRequest.instanceId} has been added to draft queue`
				: `Instance #${this.jobRequest.instanceId} has been added to saved test queue`;

		return this.notify(TEST_LOGS_SERVICE_TAGS.TEST_ADDED_TO_QUEUE, message);
	}

	async notifyTestRunning() {
		return this.notify(TEST_LOGS_SERVICE_TAGS.TEST_RUNNING, `Instance #${this.jobRequest.instanceId} is running `);
	}

	async notifyTestExecutionPassed(meta?: any) {
		return this.notify(TEST_LOGS_SERVICE_TAGS.TEST_EXECUTION_COMPLETED, `Instance #${this.jobRequest.instanceId} perfectly executed`, meta);
	}

	async notifyTestExecutionFailed(meta?: any) {
		return this.notify(TEST_LOGS_SERVICE_TAGS.TEST_EXECUTION_FAILED, `Instance #${this.jobRequest.instanceId} couldn't be executed`, {
			...meta,
			isError: true,
		});
	}
}
