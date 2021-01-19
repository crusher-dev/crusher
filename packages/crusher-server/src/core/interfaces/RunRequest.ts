import { RunTestRequestBody } from "./RunTestRequestBody";
import { iJob } from "../../../../crusher-shared/types/db/job";

interface iRunnerJob extends iJob {
	report_id: number;
}

export interface RunRequest {
	job?: iRunnerJob;
	test: RunTestRequestBody;
	instanceId?: number;
	testCount?: number;
}
