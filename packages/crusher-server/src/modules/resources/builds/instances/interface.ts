import { iAction } from "@crusher-shared/types/action";
import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
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
	recorded_video_uri?: string;
	recorded_clip_video_url?: string;
	har_url?: string;
	meta?: string;
	context: any;
	group_id?: string;
}

export interface ITestInstanceScreenshotsTable extends BaseRowInterface {
	id: number;
	instance_id: number;
	name: string;
	url: string;
	action_index: number | string;
}

export type IAddTestIntanceScreenshotPayload = KeysToCamelCase<Omit<ITestInstanceScreenshotsTable, "id">>;

export interface IBuildTestInstanceResultsTable {
	id: number;
	screenshot_id: number;
	target_screenshot_id: number;
	instance_result_set_id: number;
	diff_delta: number;
	diff_image_url: string;
	status: TestInstanceResultStatusEnum;
	meta?: string | null;
}

export type ICreateBuildTestInstanceResultPayload = KeysToCamelCase<Omit<IBuildTestInstanceResultsTable, "id" | "meta"> & {
	meta?: any;
}>;

export enum TestInstanceResultSetStatusEnum {
	WAITING_FOR_TEST_EXECUTION = "WAITING_FOR_TEST_EXECUTION",
	RUNNING_CHECKS = "RUNNING_CHECKS",
	FINISHED_RUNNING_CHECKS = "FINISHED_RUNNING_CHECKS",
}

export enum TestInstanceResultSetConclusionEnum {
	PASSED = "PASSED",
	FAILED = "FAILED",
	MANUAL_REVIEW_REQUIRED = "MANUAL_REVIEW_REQUIRED",
}

export enum TestInstanceResultStatusEnum {
	PASSED = "PASSED",
	FAILED = "FAILED",
	MANUAL_REVIEW_REQUIRED = "MANUAL_REVIEW_REQUIRED",
}

export interface ITestInstanceResultSetsTable extends BaseRowInterface {
	id: number;
	report_id: number;
	instance_id: number;
	target_instance_id: number;
	status: TestInstanceResultSetStatusEnum;
	conclusion: TestInstanceResultSetConclusionEnum | null;
	failed_reason: string | null;
}

export type ILogProgressRequestPayload = {
	step: iAction;
	status: "RUNNING" | "COMPLETED" | "FAILED";
	payload?: any;
	githubCheckRunId?: string | null;
};

export interface IBuildInstanceActionResults extends BaseRowInterface {
	instance_id: number;
	project_id: number;
	actions_result: string;
	has_instance_passed: boolean;
}

export type ICreateTestInstancePayload = {
	host: string;
	browser: BrowserEnum[];

	// Used when spawned from custom code
	isSpawned?: boolean;
};
