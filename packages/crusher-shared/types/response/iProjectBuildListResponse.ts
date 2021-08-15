import { JobReportStatus } from "../../types/jobReportStatus";

interface Tests {
	totalCount: number;
	passedCount: number;
	failedCount: number;
	reviewRequiredCount: number;
}

export enum BuildTriggerEnum {
	MANUAL = "MANUAL",
	CLI = "CLI",
	CRON = "CRON",
}

export interface IProjectBuildListItem {
	id: number;
	name: string;
	trigger: BuildTriggerEnum;
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

export type IProjectBuildListResponse = {
	list: Array<IProjectBuildListItem>;
	totalPages: number;
};
