import { JobReportStatus } from "@crusher-shared/types/jobReportStatus";
import { DBManager } from "@modules/db";
import { Service, Inject } from "typedi";
import { PLATFORM } from "@crusher-shared/types/platform";
import { ICreateBuildRequestPayload } from "@modules/resources/builds/interface";
import { getSnakedObject } from "@utils/helper";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";

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
}

@Service()
class BuildsService {
	@Inject()
	private dbManager: DBManager;

	@CamelizeResponse()
	async getBuildInfoList(projectId: number): Promise<Array<IBuildInfoItem>> {
		return this.dbManager.fetchAllRows(
			"SELECT jobs.id buildId, jobs.commit_name buildName, TIME_TO_SEC(TIMEDIFF(job_reports.updated_at, job_reports.created_at)) buildDuration, jobs.created_at buildCreatedAt, job_reports.created_at buildReportCreatedAt, job_reports.updated_at buildReportUpdatedAt, jobs.latest_report_id latestReportId, job_reports.status buildStatus, job_reports.total_test_count totalTestCount, job_reports.passed_test_count passedTestCount, job_reports.failed_test_count failedTestCount, job_reports.review_required_test_count reviewRequiredTestCount, comments.count commentCount, users.id triggeredById, users.name triggeredByName FROM users, jobs, job_reports LEFT JOIN (SELECT report_id, COUNT(*) count FROM comments GROUP BY report_id) as comments ON comments.report_id = job_reports.id WHERE jobs.project_id = ? AND job_reports.id = jobs.latest_report_id AND jobs.user_id = users.id",
			[projectId],
		);
	}

	async createBuild(buildInfo: ICreateBuildRequestPayload): Promise<any> {
		const buildConfig = Object.assign({ browser: PLATFORM.CHROME }, buildInfo.config);

		return this.dbManager.insert(`INSERT INTO jobs SET ?`, [
			getSnakedObject({
				...buildInfo,
				config: JSON.stringify(buildConfig),
			}),
		]);
	}
}

export { BuildsService };
