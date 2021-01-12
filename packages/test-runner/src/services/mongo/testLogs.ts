import { TestsLogs } from '../../models/testLogs';
import { TestTypes } from '../../interfaces/TestTypes';

export const TEST_LOGS_SERVICE_TAGS = {
	TEST_ADDED_TO_QUEUE: 'TEST_ADDED_TO_QUEUE',
	TEST_RUNNING: 'TEST_RUNNING',
	ELEMENT_CLICK: 'ELEMENT_CLICK',
	ELEMENT_HOVER: 'ELEMENT_HOVER',
	NAVIGATE_PAGE: 'NAVIGATE_PAGE',
	PAGE_SCREENSHOT: 'PAGE_SCREENSHOT',
	ELEMENT_SCREENSHOT: 'ELEMENT_SCREENSHOT',
	TEST_EXECUTION_FAILED: 'TEST_EXECUTION_FAILED',
	TEST_EXECUTION_COMPLETED: 'TEST_EXECUTION_COMPLETED',
};
export class TestLogsService {
	testId: number;
	type: string;
	jobId: number;
	instanceId: number;

	init(testId: number, instanceId: number, type: string = TestTypes.DRAFT, jobId: number = -1) {
		this.testId = testId;
		this.type = type;
		this.jobId = jobId;
		this.instanceId = instanceId;
	}

	async notifyTestAddedToQueue() {
		await new TestsLogs({
			tag: TEST_LOGS_SERVICE_TAGS.TEST_ADDED_TO_QUEUE,
			message: `Test #${this.testId} has been added to draft queue`,
			jobId: this.jobId,
			testId: this.testId,
			instanceId: this.instanceId,
			type: this.type,
		}).save();
	}

	async notifyTestRunning() {
		await new TestsLogs({
			tag: TEST_LOGS_SERVICE_TAGS.TEST_RUNNING,
			message: `Test #${this.testId} is running now`,
			jobId: this.jobId,
			testId: this.testId,
			instanceId: this.instanceId,
			type: this.type,
		}).save();
	}

	async notifyTestExecutionPassed(meta?: any) {
		await new TestsLogs({
			tag: TEST_LOGS_SERVICE_TAGS.TEST_EXECUTION_COMPLETED,
			message: `Test #${this.testId} perfectly executed.`,
			jobId: this.jobId,
			testId: this.testId,
			instanceId: this.instanceId,
			type: this.type,
			meta,
		}).save();
	}

	async notifyTestExecutionFailed(meta?: any) {
		await new TestsLogs({
			tag: TEST_LOGS_SERVICE_TAGS.TEST_EXECUTION_FAILED,
			message: (meta.err as Error).message,
			jobId: this.jobId,
			testId: this.testId,
			instanceId: this.instanceId,
			type: this.type,
			meta: {
				...meta,
				isError: true
			},
		}).save();

		await new TestsLogs({
			tag: TEST_LOGS_SERVICE_TAGS.TEST_EXECUTION_FAILED,
			message: `Test #${this.testId} couldn't be executed.`,
			jobId: this.jobId,
			testId: this.testId,
			instanceId: this.instanceId,
			type: this.type,
			meta,
		}).save();
	}

	async notify(tag: string, message: string, meta?: any) {
		await new TestsLogs({
			tag: tag,
			message: message,
			jobId: this.jobId,
			testId: this.testId,
			instanceId: this.instanceId,
			type: this.type,
			meta,
		}).save();
	}
}
