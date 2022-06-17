import { JobReportStatus } from "@crusher-shared/types/jobReportStatus";
import { DBManager } from "@modules/db";
import { Service, Inject } from "typedi";
import { PLATFORM } from "@crusher-shared/types/platform";
import { BuildStatusEnum, BuildTriggerEnum, IBuildTable, ICreateBuildRequestPayload } from "@modules/resources/builds/interface";
import { getSnakedObject } from "@utils/helper";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { BuildReportStatusEnum } from "../buildReports/interface";
import { GithubService } from "@modules/thirdParty/github/service";
import { GithubIntegrationService } from "../integrations/githubIntegration.service";
import { BadRequestError } from "routing-controllers";
import { GithubCheckConclusionEnum } from "@modules/thirdParty/github/interface";

interface IBuildInfoItem {
	buildId: number;
	buildName: string | null;
	buildCreatedAt: string;
	buildReportCreatedAt: string;
	buildReportUpdatedAt: string;
	buildDuration: number;
	latestReportId: number;
	buildStatus: JobReportStatus;
	totalTestCount: number;
	passedTestCount: number;
	failedTestCount: number;
	reviewRequiredTestCount: number;
	commentCount: number;
	triggeredById: number;
	triggeredByName: string;
	buildTrigger: BuildTriggerEnum;
}

@Service()
class BuildsService {
	@Inject()
	private dbManager: DBManager;
	@Inject()
	private githubIntegrationService: GithubIntegrationService;

	@CamelizeResponse()
	async getBuildInfoList(
		projectId: number,
		filter: { triggerType?: BuildTriggerEnum; triggeredBy?: number; search?: string; page?: number; status?: BuildReportStatusEnum; buildId?: number },
	): Promise<{ list: Array<IBuildInfoItem>; totalPages: number }> {
		let additionalSelectColumns = "";
		let additionalFromSource = "";
		const queryParams: Array<any> = [];
		if (filter.search) {
			additionalSelectColumns +=
				"ts_rank_cd(to_tsvector(COALESCE(commit_name, '')) || to_tsvector(COALESCE(jobs.repo_name, '')) || to_tsvector(COALESCE(jobs.host, '')), query) as rank";
			additionalFromSource += `plainto_tsquery(?) query`;
			queryParams.push(filter.search);
		}

		let query = `SELECT jobs.id build_id, jobs.commit_name build_name, jobs.build_trigger build_trigger, EXTRACT(EPOCH FROM (job_reports.updated_at - job_reports.created_at)) build_duration, jobs.created_at build_created_at, job_reports.created_at build_report_created_at, job_reports.updated_at build_report_updated_at, jobs.latest_report_id latest_report_id, job_reports.status build_status, job_reports.total_test_count total_test_count, job_reports.passed_test_count passed_test_count, job_reports.failed_test_count failed_test_count, job_reports.review_required_test_count review_required_test_count, comments.count comment_count, users.id triggered_by_id, users.name triggered_by_name ${
			additionalSelectColumns.length ? `, ${additionalSelectColumns}` : ""
		} FROM public.users, public.jobs, public.job_reports LEFT JOIN (SELECT report_id, COUNT(*) count FROM public.comments GROUP BY report_id) as comments ON comments.report_id = job_reports.id ${
			additionalFromSource.length ? `, ${additionalFromSource}` : ""
		} WHERE jobs.project_id = ? AND job_reports.id = jobs.latest_report_id AND jobs.user_id = users.id AND jobs.is_draft_job = ?`;
		queryParams.push(projectId, false);

		if (filter.triggerType) {
			query += " AND jobs.build_trigger = ?";
			queryParams.push(filter.triggerType!);
		}

		if (filter.triggeredBy) {
			query += " AND users.id = ?";
			queryParams.push(filter.triggeredBy!);
		}

		if (filter.status) {
			query += " AND job_reports.status = ?";
			queryParams.push(filter.status);
		}

		if (filter.buildId) {
			query += " AND jobs.id = ?";
			queryParams.push(filter.buildId);
		}

		if (filter.search) {
			query += ` AND to_tsvector(COALESCE(jobs.commit_name, '')) || to_tsvector(COALESCE(jobs.repo_name, '')) || to_tsvector(COALESCE(jobs.host, '')) @@ query`;
		}

		const totalRecordCountQuery = `SELECT COUNT(*) count FROM (${query}) custom_query`;
		const totalRecordCountQueryResult = await this.dbManager.fetchSingleRow(totalRecordCountQuery, queryParams);

		if (filter.search) {
			query += " ORDER BY jobs.created_at DESC, rank DESC";
		} else {
			query += " ORDER BY jobs.created_at DESC";
		}

		if (filter.page !== -1) {
			query += " LIMIT ? OFFSET ?";
			// Weird bug in node-mysql2
			// https://github.com/sidorares/node-mysql2/issues/1239#issuecomment-760086130
			queryParams.push(`10`);
			queryParams.push(`${filter.page * 10}`);
		}

		return { totalPages: Math.ceil(totalRecordCountQueryResult.count / 10), list: await this.runCamelizedFetchAllQuery(query, queryParams) };
	}

	@CamelizeResponse()
	private runCamelizedFetchAllQuery(query, params) {
		return this.dbManager.fetchAllRows(query, params);
	}

	@CamelizeResponse()
	async getBuildFromReportId(reportId: number): Promise<KeysToCamelCase<IBuildTable>> {
		return this.dbManager.fetchSingleRow(
			`SELECT jobs.* FROM public.jobs, public.job_reports WHERE job_reports.id = ? AND jobs.latest_report_id = job_reports.id`,
			[reportId],
		);
	}

	@CamelizeResponse()
	async getBuild(buildId: number): Promise<KeysToCamelCase<IBuildTable> | null> {
		return this.dbManager.fetchSingleRow("SELECT * FROM public.jobs WHERE id = ?", [buildId]);
	}

	async createBuild(buildInfo: ICreateBuildRequestPayload): Promise<{ insertId: number }> {
		return this.dbManager.insert(
			`INSERT INTO public.jobs (user_id, project_id, host, status, build_trigger, browser, config, meta, is_draft_job) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				buildInfo.userId,
				buildInfo.projectId,
				buildInfo.host,
				buildInfo.status,
				buildInfo.buildTrigger,
				JSON.stringify(buildInfo.browser),
				JSON.stringify(buildInfo.config),
				buildInfo.meta ? JSON.stringify(buildInfo.meta) : null,
				buildInfo.isDraftJob ? buildInfo.isDraftJob : false,
			],
		);
	}

	async updateBuildMeta(meta: any, buildId: number) {
		return this.dbManager.update("UPDATE public.jobs SET meta = ? WHERE id = ?", [JSON.stringify(meta), buildId]);
	}

	async updateLatestReportId(latestReportId: number, buildId: number) {
		return this.dbManager.update("UPDATE public.jobs SET latest_report_id = ? WHERE id = ?", [latestReportId, buildId]);
	}

	async updateStatus(status: BuildStatusEnum, buildId: number) {
		return this.dbManager.update("UPDATE public.jobs SET status = ? WHERE id = ?", [status, buildId]);
	}

	async initGithubCheckFlow(
		githubMeta: { repoName: string; commitId: string },
		buildId: number,
	): Promise<{ installationId: any; repoName: string; commitId: string; checkRunId: any }> {
		const githubService = new GithubService();
		const buildRecord = await this.getBuild(buildId);

		const githubInstallationRecord = await this.githubIntegrationService.getInstallationRepo(githubMeta.repoName, buildRecord.projectId);
		if (!githubInstallationRecord) {
			throw new BadRequestError(`${githubMeta.repoName} is not connected to crusher`);
		}

		await githubService.authenticateAsApp(githubInstallationRecord.installationId);

		const checkRunId = await githubService.createCheckRun({
			repoName: githubMeta.repoName,
			commitId: githubMeta.commitId,
			installationId: githubInstallationRecord.installationId,
			buildId: buildId,
		});

		const meta = JSON.parse(buildRecord.meta);
		meta.githubCheckRunId = checkRunId;
		meta.repoName = githubMeta.repoName;
		meta.commitId = githubMeta.commitId;
		meta.installationId = githubInstallationRecord.installationId;

		await this.updateBuildMeta(meta, buildRecord.id);

		return { installationId: meta.installationId, repoName: meta.repoName, commitId: meta.commitId, checkRunId: meta.githubCheckRunId };
	}

	private getGithubConclusionFromReportStatus(reportStatus: BuildReportStatusEnum): GithubCheckConclusionEnum {
		switch (reportStatus) {
			case BuildReportStatusEnum.PASSED:
				return GithubCheckConclusionEnum.SUCCESS;
			case BuildReportStatusEnum.FAILED:
				return GithubCheckConclusionEnum.FAILURE;
			case BuildReportStatusEnum.MANUAL_REVIEW_REQUIRED:
				return GithubCheckConclusionEnum.ACTION_REQUIRED;
			default:
				throw new Error("Invalid value for report status");
		}
	}

	async markGithubCheckFlowFinished(buildStatus: BuildReportStatusEnum, buildId: number) {
		const githubService = new GithubService();
		const buildRecord = await this.getBuild(buildId);
		const meta = JSON.parse(buildRecord.meta);

		if (meta.github) {
			const { githubCheckRunId, repoName: fullReponame, installationId } = meta;
			const { repoName, ownerName } = githubService.extractRepoAndOwnerName(fullReponame);

			await githubService.authenticateAsApp(installationId);

			const githubCheckConclusion = this.getGithubConclusionFromReportStatus(buildStatus);
			await githubService.updateRunCheckStatus({ repo: repoName, owner: ownerName, checkRunId: githubCheckRunId }, githubCheckConclusion);
		}
	}
}

export { BuildsService };
