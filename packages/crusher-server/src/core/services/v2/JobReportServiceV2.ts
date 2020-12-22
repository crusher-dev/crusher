import { Container, Service } from "typedi";
import DBManager from "../../manager/DBManager";
import { JobReportStatus } from "../../interfaces/JobReportStatus";
import { JobTrigger } from "../../interfaces/JobTrigger";

@Service()
export default class JobReportServiceV2 {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async createJobReport(jobId: number, referenceJobId: number, projectId: number) {
		return this.dbManager.insertData(`INSERT INTO job_reports SET ?`, { job_id: jobId, reference_job_id: referenceJobId, project_id: projectId });
	}

	async getTotalJobsReportsCountInProject(projectId: number, trigger: JobTrigger) {
		if (trigger === JobTrigger.MANUAL) {
			return this.dbManager.fetchSingleRow(
				`SELECT count(*) as totalCount FROM job_reports, jobs WHERE job_reports.project_id = ? AND jobs.id = job_reports.job_id AND jobs.trigger = ?`,
				[projectId, JobTrigger.MANUAL],
			);
		} else if (trigger === JobTrigger.MONITORING) {
			return this.dbManager.fetchSingleRow(
				`SELECT count(*) as totalCount FROM job_reports, jobs WHERE job_reports.project_id = ? AND jobs.id = job_reports.job_id AND (jobs.trigger = ? OR jobs.trigger = ?) `,
				[projectId, JobTrigger.CLI, JobTrigger.CRON],
			);
		} else {
			// All
			return this.dbManager.fetchSingleRow(`SELECT count(*) as totalCount FROM job_reports WHERE project_id = ? `, [projectId]);
		}
	}

	async getAllJobReportsInProject(projectId: number) {
		return this.dbManager.fetchData(`SELECT * FROM job_reports WHERE project_id = ? ORDER BY created_at DESC`, [projectId]);
	}

	async getAllJobReportsInProjectPage(projectId: number, trigger: JobTrigger, limit = 5, offset = 0) {
		if (trigger === JobTrigger.MONITORING) {
			return this.dbManager.fetchData(
				`SELECT job_reports.id as reportId, job_reports.status as reportStatus, job_reports.job_id jobId, job_reports.reference_job_id referenceJobId, job_reports.status_explanation reportExplanation, jobs.* FROM job_reports, jobs WHERE job_reports.project_id = ? AND jobs.id = job_reports.job_id AND (jobs.trigger=? OR jobs.trigger=?) ORDER BY job_reports.created_at DESC LIMIT ?,?`,
				[projectId, JobTrigger.CRON, JobTrigger.CLI, offset, limit],
			);
		} else if (trigger === JobTrigger.MANUAL) {
			return this.dbManager.fetchData(
				`SELECT job_reports.id as reportId, job_reports.status as reportStatus, job_reports.job_id jobId, job_reports.reference_job_id referenceJobId, job_reports.status_explanation reportExplanation, jobs.* FROM job_reports, jobs WHERE job_reports.project_id = ? AND jobs.id = job_reports.job_id AND jobs.trigger=? ORDER BY job_reports.created_at DESC LIMIT ?,?`,
				[projectId, trigger, offset, limit],
			);
		} else {
			return this.dbManager.fetchData(
				`SELECT job_reports.id as reportId, job_reports.status as reportStatus, job_reports.job_id jobId, job_reports.reference_job_id referenceJobId, job_reports.status_explanation reportExplanation, jobs.* FROM job_reports, jobs WHERE job_reports.project_id = ? AND jobs.id = job_reports.job_id ORDER BY job_reports.created_at DESC LIMIT ?,?`,
				[projectId, offset, limit],
			);
		}
	}

	async getJobReport(reportId: number) {
		return this.dbManager.fetchSingleRow(`SELECT * FROM job_reports WHERE id = ?`, [reportId]);
	}

	async updateJobReportStatus(status: JobReportStatus, reportId: number, explanation: string | null = null) {
		return this.dbManager.fetchSingleRow(`UPDATE job_reports SET ? WHERE id = ?`, [{ status: status, status_explanation: explanation }, reportId]);
	}
}
