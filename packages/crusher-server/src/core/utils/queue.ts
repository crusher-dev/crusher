import { Queue } from "bullmq";

import { REDIS } from "../../../config/database";
import { RunRequest } from "../interfaces/RunRequest";
import TestInstanceService from "../services/TestInstanceService";
import { InstanceStatus } from "../interfaces/InstanceStatus";
import { TEST_INSTANCE_PLATFORM } from "../../constants";
import { Platform } from "../interfaces/Platform";
import DraftInstanceService from "../services/DraftInstanceService";
import { TestType } from "../interfaces/TestType";
import { JobLogs } from "../../server/models/jobLogs";
import { TestLogsService } from "../services/mongo/testLogs";
import { Logger } from "../../utils/logger";
import * as chalk from "chalk";
import JobReportServiceV2 from "../services/v2/JobReportServiceV2";
import JobsService from "../services/JobsService";
import { iJobRunRequest } from "../../../../crusher-shared/types/runner/jobRunRequest";
import { PLATFORM } from "../../../../crusher-shared/types/platform";

const testInstanceService = new TestInstanceService();
const draftInstanceService = new DraftInstanceService();
const jobReportsService = new JobReportServiceV2();
const jobsService = new JobsService();

const requestQueue = new Queue("request-queue", {
	// @ts-ignore
	connection: REDIS,
});

export async function addTestRequestToQueue(testRequest: RunRequest) {
	const { test, job, testCount } = testRequest;
	const testLogsService = new TestLogsService();
	Logger.debug("Queue::addTestToQueue", chalk.hex("#0b2ce2").bold(`Got a request for test run :`), [test, job]);

	let instanceId = 0;
	const { host } = job ? job : ({} as any);

	console.log("INSIDE THE TEST ADD QUEUE", true);

	if (test.testType !== TestType.DRAFT && job) {
		const instance = await testInstanceService.createNewTestInstance({
			jobId: job.id,
			testId: test.id,
			status: InstanceStatus.QUEUED,
			host: job.host ? job.host : "none",
			code: "",
			platform: job.platform ? job.platform : TEST_INSTANCE_PLATFORM.CHROME,
		});

		instanceId = instance.insertId;
	} else {
		const instance = await draftInstanceService.createNewDraftInstance({
			draft_id: test.id,
			status: InstanceStatus.QUEUED,
			code: "",
			platform: job && job.platform ? job.platform : Platform.CHROME,
		});
		instanceId = instance.insertId;
	}

	testLogsService.init(test.id, instanceId, test.testType, job ? job.id : -1);
	await testLogsService.notifyTestAddedToQueue();

	await requestQueue.add(
		test.id.toString(),
		{
			job,
			test: { ...test, events: JSON.parse(test.events) },
			requestType: test.testType,
			platform: job && job.platform ? job.platform : Platform.CHROME,
			testCount: testCount,
			instanceId: instanceId,
		} as iJobRunRequest,
		{ lifo: false },
	);
}

export async function addJobToRequestQueue(jobRequest) {
	const { jobId, projectId, platform, tests, testType } = jobRequest;

	const job = await jobsService.getJob(jobId);
	const referenceJob = await jobsService.getReferenceJob(job);
	const jobReportsId = await jobReportsService.createJobReport(jobId, referenceJob ? referenceJob.id : jobId, projectId);

	const totalTestCount = tests.reduce((prev, current) => {
		const count = platform === PLATFORM.ALL ? 3 : 1;
		return prev + count;
	}, 0);

	for (const test of tests) {
		if (platform === Platform.ALL) {
			await addTestRequestToQueue({
				job: {
					...job,
					report_id: jobReportsId.insertId,
					platform: PLATFORM.CHROME,
				},
				test: { ...test, testType: testType },
				testCount: totalTestCount,
			});
		} else {
			await addTestRequestToQueue({
				job: { ...job, report_id: jobReportsId.insertId, platform: platform },
				test: { ...test, testType: testType },
				testCount: totalTestCount,
			});
		}
	}

	Logger.debug("addJobToRequestQueue", "Time to send logs");
	await new JobLogs({
		tag: "TESTS_QUEUED_FOR_JOB",
		message: `${tests.length * (platform === Platform.ALL ? 3 : 1)} tests added to queue`,
		jobId: jobId,
	}).save(function (err) {
		if (err) {
			Logger.debug("addJobToRequestQueue", "We got an error period", { err });
			console.error(err);
		}
	});
}
