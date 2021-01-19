import { Queue } from "bullmq";

import { REDDIS } from "../../../config/database";
import { RunRequest } from "../interfaces/RunRequest";
import TestInstanceService from "../services/TestInstanceService";
import { InstanceStatus } from "../interfaces/InstanceStatus";
import { TEST_INSTANCE_PLATFORM } from "../../constants";
import { Platform } from "../interfaces/Platform";
import DraftInstanceService from "../services/DraftInstanceService";
import { TestType } from "../interfaces/TestType";
import { JobLogs } from "../../server/models/jobLogs";
import { TestLogsService } from "../services/mongo/testLogs";
import { CodeGenerator } from "../../../../code-generator/src/generator";
import { Logger } from "../../utils/logger";
import * as chalk from "chalk";
import JobReportServiceV2 from "../services/v2/JobReportServiceV2";
import JobsService from "../services/JobsService";
import { BROWSER } from "../../../../crusher-shared/types/browser";
import { iJobRunRequest } from "../../../../crusher-shared/types/runner/jobRunRequest";
import { PLATFORM } from "../../../../crusher-shared/types/platform";

const path = require("path");

const testInstanceService = new TestInstanceService();
const draftInstanceService = new DraftInstanceService();
const jobReportsService = new JobReportServiceV2();
const jobsService = new JobsService();

const requestQueue = new Queue("request-queue", {
	// @ts-ignore
	connection: REDDIS,
});
const codeGenerator = new CodeGenerator({
	isLiveLogsOn: true,
	shouldRecordVideo: true,
	isHeadless: false,
	browser: BROWSER.CHROME,
});

function getGeneratedCode(test, platform, testType) {
	return codeGenerator.parse(JSON.parse(test.events));
}

export async function addTestRequestToQueue(testRequest: RunRequest) {
	const { test, job, testCount } = testRequest;
	const testLogsService = new TestLogsService();
	Logger.debug("Queue::addTestToQueue", chalk.hex("#0b2ce2").bold(`Got a request for test run :`), [test, job]);

	let instanceId = 0;
	const { host } = job ? job : ({} as any);

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

	const client = await requestQueue.client;
	if (job) {
		await client.set(`${job.id}:completed`, "0");
		await client.set(`${job.id}:started`, "0");
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

	for (let test of tests) {
		if (platform === Platform.ALL) {
			await addTestRequestToQueue({
				job: { ...job, report_id: jobReportsId, platform: PLATFORM.CHROME },
				test: { ...test, testType: testType },
				testCount: tests.length,
			});
			await addTestRequestToQueue({
				job: { ...job, report_id: jobReportsId, platform: PLATFORM.SAFARI },
				test: { ...test, testType: testType },
				testCount: tests.length,
			});
			await addTestRequestToQueue({
				job: { ...job, report_id: jobReportsId, platform: PLATFORM.FIREFOX },
				test: { ...test, testType: testType },
				testCount: tests.length,
			});
		} else {
			await addTestRequestToQueue({
				job: { ...job, report_id: jobReportsId, platform: platform },
				test: { ...test, testType: testType },
				testCount: tests.length,
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
