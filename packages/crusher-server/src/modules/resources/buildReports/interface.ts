import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";

export enum BuildReportStatusEnum {
	PASSED = "PASSED",
	FAILED = "FAILED",
	MANUAL_REVIEW_REQUIRED = "MANUAL_REVIEW_REQUIRED",
	RUNNING = "RUNNNING",
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
