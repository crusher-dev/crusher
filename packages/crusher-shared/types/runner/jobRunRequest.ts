import { RUNNER_REQUEST_TYPE } from "./requestType";
import { iJob } from "../db/job";
import { iTestJobRequestBody } from "./testJobRequestBody";
import { PLATFORM } from "../platform";
import { iAction } from "../action";
import { BrowserEnum } from "../browser";

interface iRequestJob extends iJob {
	report_id: number;
}

export interface iJobRunRequest {
	requestType: RUNNER_REQUEST_TYPE;
	job?: iRequestJob;
	test?: iTestJobRequestBody;
	platform: PLATFORM;
	instanceId: number; // Could be either draft instance id or test instance id
	testCount: number;
}

export interface ITestRunConfig {
	browser: BrowserEnum;
	shouldRecordVideo: boolean;
}

export interface IJobRunRequest {
	actions: Array<iAction>;
	config: ITestRunConfig;
	buildId; number
	testInstanceId: number;
	testName: string;
	buildTestCount: number;
	// @TODO: Revisit. Is there a reference to this?
	githubCheckRunId?: string;
}