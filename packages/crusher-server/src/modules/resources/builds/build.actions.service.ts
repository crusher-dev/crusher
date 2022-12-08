import { JobReportStatus } from "@crusher-shared/types/jobReportStatus";
import { DBManager } from "@modules/db";
import { Service, Inject } from "typedi";
import { BuildStatusEnum, BuildTriggerEnum, IBuildTable, ICreateBuildRequestPayload } from "@modules/resources/builds/interface";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { BuildReportStatusEnum } from "../buildReports/interface";
import { TestsRunner } from "@modules/runner";
import { TestService } from "../tests/service";
import { BuildReportService } from "../buildReports/service";
import { ITestTable } from "../tests/interface";
import { BuildsService } from "./service";

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
class BuildsActionService {
	@Inject()
	private dbManager: DBManager;
	@Inject()
	private buildsService: BuildsService;
	@Inject()
	private buildReportService: BuildReportService;
	@Inject()
	private testService: TestService;
	@Inject()
	private testRunner: TestsRunner;

	async rerunBuild(buildId: number, user_id: number) {
		const buildRecord = await this.buildsService.getBuild(buildId);
		if (!buildRecord || !buildRecord.config || !buildRecord.latestReportId) throw new Error("Invalid build record to rerun");
		const buildReportRecord = await this.buildReportService.getBuildReportRecord(buildRecord.latestReportId);

		const buildRecordMeta: { testIds: Array<number>; shouldRecordVideo: boolean } = buildRecord.config;
		const testsList = await this.testService.getTestsFromIdList(buildRecordMeta.testIds);

		// @TODO: Add support to use exact same build config (like proxy, etc)
		return this.testRunner.runTests(
			await this.testService.getFullTestArr(await this.testService.getCompleteTestsArray(testsList)),
			{
				userId: user_id,
				projectId: buildRecord.projectId,
				// @TODO: Use proper value of host here
				host: buildRecord.host || "null",
				status: BuildStatusEnum.CREATED,
				buildTrigger: BuildTriggerEnum.MANUAL,
				browser: buildRecord.browser,
				isDraftJob: false,
				config: buildRecord.config,
				meta: buildRecord.meta ? JSON.parse(buildRecord.meta) : null,
			} as any,
			buildReportRecord.referenceJobId,
		);
	}
}

export { BuildsActionService };
