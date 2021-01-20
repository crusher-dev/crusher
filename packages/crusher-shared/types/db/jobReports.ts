import { BaseRowInterface } from "./baseRow";
import { JobReportStatus } from '../jobReportStatus';

export interface iJobReports extends BaseRowInterface {
	id: number;
	job_id: number;
	reference_job_id: number;
	status: JobReportStatus;
	status_explanation?: string;
	project_id: number;
}
