import { JobReportStatus } from "../../types/jobReportStatus";

interface Tests {
	totalCount: number;
	passedCount: number;
	failedCount: number;
	reviewRequiredCount: number;
}

export interface IProjectBuildListItem {
	id: number;
	name: string;
	createdAt: number;
	tests: Tests;
	status: JobReportStatus;
	duration: number;
	triggeredBy: {
		id: number;
		name: string;
	};
	commentCount: number;
}

export type IProjectBuildListResponse = Array<IProjectBuildListItem>;
