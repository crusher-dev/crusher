import { DBManager } from "@modules/db";
import { Service, Inject } from "typedi";
import { BuildStatusEnum, BuildTriggerEnum } from "@modules/resources/builds/interface";
import { TestsRunner } from "@modules/runner";
import { TestService } from "../tests/service";
import { BuildReportService } from "../buildReports/service";
import { BuildsService } from "./service";

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
		if (!buildRecord || !buildRecord.config || !buildRecord.latestReportId) throw Error("Invalid build record to rerun");
		const buildReportRecord = await this.buildReportService.getBuildReportRecord(buildRecord.latestReportId);

		const buildRecordMeta: { testIds: number[]; shouldRecordVideo: boolean } = buildRecord.config;
		const testsList = await this.testService.getTestsFromIdList(buildRecordMeta.testIds);

		return this.testRunner.runTests(
			await this.testService.getFullTestArr(await this.testService.getCompleteTestsArray(testsList)),
			{
				userId: user_id,
				projectId: buildRecord.projectId,
				// @TODO: Use proper value of host here
				host: "null",
				status: BuildStatusEnum.CREATED,
				buildTrigger: BuildTriggerEnum.MANUAL,
				browser: buildRecord.browser,
				isDraftJob: false,
				config: buildRecord.config,
				meta: buildRecord.meta ? JSON.parse(buildRecord.meta) : null,
			},
			buildReportRecord.referenceJobId,
		);
	}
}

export { BuildsActionService };
