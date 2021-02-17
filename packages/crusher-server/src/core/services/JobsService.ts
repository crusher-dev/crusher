import { Container, Service } from "typedi";
import DBManager from "../manager/DBManager";
import { JobBuild } from "../interfaces/db/JobBuild";
import { JobTrigger } from "../interfaces/JobTrigger";
import { JobStatus } from "../interfaces/JobStatus";
import { InsertRecordResponse } from "../interfaces/services/InsertRecordResponse";
import { JobConclusion } from "../interfaces/JobConclusion";

export const TRIGGER = {
	MANUAL: "MANUAL",
	CRON: "CRON",
	CLI: "CLI",
};

@Service()
export default class JobsService {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async createJob(details: JobBuild): Promise<InsertRecordResponse> {
		return this.dbManager.insertData(`INSERT INTO jobs SET ?`, details);
	}

	async getJob(jobId: number) {
		return this.dbManager.fetchSingleRow(`SELECT * FROM jobs WHERE id = ?`, [jobId]);
	}

	async getAllJobsOfPr(prId: number) {
		return this.dbManager.fetchData(`SELECT * FROM jobs WHERE pr_id = ?`, [prId]);
	}

	async stopAllJobsRunningForMoreThanAnHour() {
		// @TODO: Link this to job_reports
		return this.dbManager.fetchSingleRow(`UPDATE jobs SET status = ? WHERE status = ? OR status = ?`, [
			JobStatus.TIMEOUT,
			JobStatus.RUNNING,
			JobStatus.QUEUED,
		]);
	}

	async getAllJobsOfProject(projectId: number, trigger: JobTrigger, limit = 5, offset = 0) {
		if (!trigger) {
			return this.dbManager.fetchData(`SELECT * FROM jobs WHERE project_id = ? ORDER BY created_at DESC LIMIT ?,?`, [projectId, offset, limit]);
		}
		if (trigger === JobTrigger.MONITORING) {
			return this.dbManager.fetchData(`SELECT * FROM jobs WHERE project_id = ? AND (\`trigger\`=? OR \`trigger\`=?) ORDER BY created_at DESC LIMIT ?,?`, [
				projectId,
				JobTrigger.CRON,
				JobTrigger.CLI,
				offset,
				limit,
			]);
		} else {
			return this.dbManager.fetchData(`SELECT * FROM jobs WHERE project_id = ? AND \`trigger\`=? ORDER BY created_at DESC LIMIT ?,?`, [
				projectId,
				trigger,
				offset,
				limit,
			]);
		}
	}

	async getTotalScreenshotsInJob(jobId: number): Promise<number> {
		const record = await this.dbManager.fetchSingleRow(
			`SELECT Count(*) as totalCount FROM test_instance_screenshots, test_instances WHERE test_instances.job_id = ? AND test_instance_screenshots.instance_id=test_instances.id`,
			[jobId],
		);
		return record.totalCount;
	}

	async getScreenshotsCountInJobReport(
		reportId: number,
		jobId: number,
	): Promise<{
		passedCount: number;
		failedCount: number;
		reviewRequiredCount: number;
		totalComparisonCount: number;
	}> {
		const totalScreenshots = await this.dbManager.fetchSingleRow(
			"SELECT COUNT(*) as count FROM test_instance_screenshots, test_instances WHERE test_instances.job_id = ? AND test_instance_screenshots.instance_id = test_instances.id",
			[jobId],
		);
		const countRecord = await this.dbManager.fetchSingleRow(
			`SELECT COUNT(case test_instance_results.status when 'PASSED' then 1 else null end) passedCount, COUNT(case test_instance_results.status when 'FAILED' then 1 else null end) failedCount, COUNT(case test_instance_results.status when 'MANUAL_REVIEW_REQUIRED' then 1 when 'ERROR_CREATING_DIFF' then 1 else null end) reviewCount from test_instance_result_sets, test_instance_results WHERE test_instance_result_sets.report_id = ? AND test_instance_results.instance_result_set_id=test_instance_result_sets.id`,
			[reportId],
		);
		return {
			passedCount: totalScreenshots.count - (countRecord.failedCount + countRecord.reviewCount),
			failedCount: countRecord.failedCount,
			reviewRequiredCount: countRecord.reviewCount,
			totalComparisonCount: totalScreenshots.count,
		};
	}

	async getScreenshotsCountInJob(
		jobId: number,
		targetJobId: number,
	): Promise<{
		passedCount: number;
		failedCount: number;
		reviewRequiredCount: number;
		totalComparisonCount: number;
	}> {
		const totalScreenshots = await this.dbManager.fetchSingleRow(
			"SELECT COUNT(*) as count FROM test_instance_screenshots, test_instances WHERE test_instances.job_id = ? AND test_instance_screenshots.instance_id = test_instances.id",
			[jobId],
		);
		const countRecord = await this.dbManager.fetchSingleRow(
			`SELECT COUNT(case conclusion when 'PASSED' then 1 else null end) passedCount, COUNT(case conclusion when 'FAILED' then 1 else null end) failedCount, COUNT(case conclusion when 'MANUAL_REVIEW_REQUIRED' then 1 else null end) reviewCount from test_instance_result_sets WHERE job_id = ? AND target_job_id = ?`,
			[jobId, targetJobId],
		);
		return {
			passedCount: totalScreenshots.count - (countRecord.failedCount + countRecord.reviewCount),
			failedCount: countRecord.failedCount,
			reviewRequiredCount: countRecord.reviewCount,
			totalComparisonCount: totalScreenshots.count,
		};
	}

	async getTotalJobs(projectId, trigger) {
		let countRecord;
		if (!trigger) {
			countRecord = await this.dbManager.fetchSingleRow(`SELECT count(*) as totalCount FROM jobs WHERE project_id = ?`, [projectId]);
		} else {
			if (trigger === JobTrigger.MONITORING) {
				countRecord = await this.dbManager.fetchSingleRow(
					`SELECT count(*) as totalCount FROM jobs WHERE project_id = ? AND (\`trigger\` = ? OR \`trigger\` = ?)`,
					[projectId, JobTrigger.CLI, JobTrigger.CRON],
				);
			} else if (trigger === JobTrigger.MANUAL) {
				countRecord = await this.dbManager.fetchSingleRow(`SELECT count(*) as totalCount FROM jobs WHERE project_id = ? AND \`trigger\` = ?`, [
					projectId,
					trigger,
				]);
			}
		}
		return countRecord ? countRecord.totalCount : 0;
	}

	async getReferenceJob(job1) {
		const { id, host, meta } = job1;
		const testIds = JSON.parse(meta).sort();

		if (host) {
			return this.dbManager.fetchSingleRow(`SELECT * FROM jobs WHERE host = ? AND meta = ? AND status = ? AND NOT (id = ?) ORDER BY created_at DESC`, [
				host,
				JSON.stringify(testIds),
				JobStatus.FINISHED,
				id,
			]);
		} else {
			return this.dbManager.fetchSingleRow(
				`SELECT * FROM jobs WHERE host IS NULL AND meta = ? AND status = ? AND NOT (id = ?) ORDER BY created_at DESC`,
				[JSON.stringify(testIds), JobStatus.FINISHED, id],
			);
		}
	}

	async getLastNLogsOfProject(projectId: number, limit = 5) {
		return this.dbManager.fetchData(
			`SELECT test_instances.id, test_instances.created_at, jobs.trigger, test_instances.status FROM jobs, test_instances WHERE jobs.project_id = ? AND test_instances.job_id=jobs.id LIMIT ?`,
			[projectId, limit],
		);
	}

	async deleteJob(jobId: number) {
		return this.dbManager.fetchSingleRow(`DELETE FROM jobs WHERE id = ?`, [jobId]);
	}

	async updateJobStatus(status: string, jobId: number) {
		return this.dbManager.fetchSingleRow(`UPDATE jobs SET status = ? WHERE id = ?`, [status, jobId]);
	}

	async updateJobInfo(jobId: number, payload) {
		payload = {
			project_id: payload.projectId,
			trigger: payload.trigger,
			host: payload.host,
			status: payload.status,
			pr_id: payload.prId,
			branch_name: payload.branchName,
			commit_id: payload.commitId,
			repo_name: payload.repoName,
			installation_id: payload.installationId,
			conclusion: payload.conclusion,
			user_id: payload.user_id,
			check_run_id: payload.check_run_id,
		};

		const valuesToUpdate = Object.keys(payload).reduce((prev, key) => {
			if (payload[key]) {
				return { ...prev, [key]: payload[key] };
			} else {
				return prev;
			}
		}, {});

		if (!Object.keys(valuesToUpdate).length) return false;

		return this.dbManager.fetchSingleRow(`UPDATE jobs SET ? WHERE id = ?`, [valuesToUpdate, jobId]);
	}

	async getFirstJobOfHost(host: string) {
		return this.dbManager.fetchSingleRow(`SELECT * FROM jobs WHERE host = ? ORDER BY created_at ASC LIMIT 1`, [host]);
	}

	async getGithubJobFromGitInfo(repoName, sha) {
		if (!repoName || !sha) {
			return null;
		}

		return this.dbManager.fetchSingleRow(`SELECT * FROM jobs WHERE repo_name = ? AND commit_id = ? AND status = ?`, [repoName, sha, JobStatus.QUEUED]);
	}

	async createOrUpdateJob(repoName: string, commitId: string, details: any) {
		const { platform, projectId, host, branchName, installation_id, testIds, userId, trigger } = details;

		const insertedJob: InsertRecordResponse = await this.createJob({
			project_id: projectId,
			trigger: trigger ? trigger : JobTrigger.MANUAL,
			host: host ? host : null,
			status: JobStatus.QUEUED,
			pr_id: null,
			branch_name: branchName,
			commit_id: commitId,
			user_id: userId,
			repo_name: repoName,
			installation_id: installation_id,
			commit_name: null,
			meta: JSON.stringify(testIds),
			platform: platform,
		});

		return this.getJob(insertedJob.insertId);
	}
}
