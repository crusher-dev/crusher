import { RUNNER_REQUEST_TYPE } from "./requestType";
import { iJob } from "../db/job";
import { iTestJobRequestBody } from "./testJobRequestBody";
import { PLATFORM } from "../platform";

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
