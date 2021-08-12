import { JobReportStatus } from "@crusher-shared/types/jobReportStatus";
import { DBManager } from "@modules/db";
import { Service, Inject } from "typedi";
import { PLATFORM } from "@crusher-shared/types/platform";
import { BuildTriggerEnum, IBuildTable, ICreateBuildRequestPayload } from "@modules/resources/builds/interface";
import { getSnakedObject } from "@utils/helper";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { KeysToCamelCase } from "@modules/common/typescript/interface";

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

	@CamelizeResponse()
	async getBuildInfoList(projectId: number, filter: { triggerType?: BuildTriggerEnum }): Promise<Array<IBuildInfoItem>> {
		let query =
			"SELECT jobs.id buildId, jobs.commit_name buildName, jobs.build_trigger buildTrigger, TIME_TO_SEC(TIMEDIFF(job_reports.updated_at, job_reports.created_at)) buildDuration, jobs.created_at buildCreatedAt, job_reports.created_at buildReportCreatedAt, job_reports.updated_at buildReportUpdatedAt, jobs.latest_report_id latestReportId, job_reports.status buildStatus, job_reports.total_test_count totalTestCount, job_reports.passed_test_count passedTestCount, job_reports.failed_test_count failedTestCount, job_reports.review_required_test_count reviewRequiredTestCount, comments.count commentCount, users.id triggeredById, users.name triggeredByName FROM users, jobs, job_reports LEFT JOIN (SELECT report_id, COUNT(*) count FROM comments GROUP BY report_id) as comments ON comments.report_id = job_reports.id WHERE jobs.project_id = ? AND job_reports.id = jobs.latest_report_id AND jobs.user_id = users.id";
		const queryParams: Array<any> = [projectId];

		if (filter.triggerType) {
			query += " AND buildTrigger = ?";
			queryParams.push(filter.triggerType!);
		}

		return this.dbManager.fetchAllRows(query, queryParams);
	}

	@CamelizeResponse()
	async getBuild(buildId: number): Promise<KeysToCamelCase<IBuildTable> | null> {
		return this.dbManager.fetchSingleRow("SELECT * FROM jobs WHERE id = ?", [buildId]);
	}

	async createBuild(buildInfo: ICreateBuildRequestPayload): Promise<{ insertId: number }> {
		return this.dbManager.insert(`INSERT INTO jobs SET user_id = ?, project_id = ?, host = ?, status = ?, build_trigger = ?, browser = ?, config = ?`, [
			buildInfo.userId,
			buildInfo.projectId,
			buildInfo.host,
			buildInfo.status,
			buildInfo.buildTrigger,
			buildInfo.browser,
			JSON.stringify(buildInfo.config),
		]);
	}

	async updateLatestReportId(latestReportId: number, buildId: number) {
		return this.dbManager.update("UPDATE jobs SET latest_report_id = ? WHERE id = ?", [latestReportId, buildId]);
	}
}

export { BuildsService };
