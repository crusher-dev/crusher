import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";

export enum BuildReportStatusEnum {
	PASSED = "PASSED",
	FAILED = "FAILED",
	MANUAL_REVIEW_REQUIRED = "MANUAL_REVIEW_REQUIRED",
	RUNNING = "RUNNING",
}

export interface IBuildReportTable extends BaseRowInterface {
	id: number;
	job_id: number;
	reference_job_id: number;
	total_test_count: number | null;
	passed_test_count: number | null;
	failed_test_count: number | null;
	review_required_test_count: number | null;
	project_id: number;
	status: BuildReportStatusEnum;
}

export enum TestInstanceResultSetStatus {
	RUNNING_CHECKS = "RUNNING_CHECKS",
	FINISHED_RUNNING_CHECKS = "FINISHED_RUNNING_CHECKS",
	ERROR_RUNNING_CHECKS = "ERROR_RUNNING_CHECKS",
	TIMEOUT = "TIMEOUT",
}

export enum TestInstanceResultSetConclusion {
	PASSED = "PASSED",
	FAILED = "FAILED",
	MANUAL_REVIEW_REQUIRED = "MANUAL_REVIEW_REQUIRED",
	RUNNING_NOW = "RUNNING",
}
