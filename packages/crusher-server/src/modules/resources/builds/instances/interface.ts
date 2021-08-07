import { iAction } from "@crusher-shared/types/action";
import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { BrowserEnum } from "@modules/runner/interface";

export enum TestInstanceStatusEnum {
	QUEUED = "QUEUED",
	RUNNING = "RUNNING",
	FINISHED = "FINISHED",
	TIMEOUT = "TIMEOUT",
	ABORTED = "ABORTED",
}

export interface ITestInstancesTable extends BaseRowInterface {
	id: number;
	job_id: number;
	test_id: number;
	status: TestInstanceStatusEnum;
	code: string;
	browser: BrowserEnum;
	host: string;
}

export type ILogProgressRequestPayload = {
	step: iAction;
	status: "RUNNING" | "COMPLETED" | "FAILED";
	payload?: any;
	githubCheckRunId?: string | null;
};
