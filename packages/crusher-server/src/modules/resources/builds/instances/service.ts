import { Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import {
	ICreateBuildTestInstanceResultPayload,
	ILogProgressRequestPayload,
	ITestInstanceResultSetsTable,
	ITestInstanceScreenshotsTable,
	ITestInstancesTable,
	TestInstanceResultSetConclusionEnum,
	TestInstanceResultSetStatusEnum,
	TestInstanceResultStatusEnum,
	TestInstanceStatusEnum,
} from "./interface";
import { IActionResultItemWithIndex, ISavedActionResultItemWithIndex } from "@crusher-shared/types/common/general";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { VisualDiffService } from "@modules/visualDiff";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { BuildTestInstanceScreenshotService } from "./screenshots.service";
import * as path from "path";
import { IVisualDiffResult } from "@modules/visualDiff/interface";
import { TestInstanceResultSetConclusion } from "@core/interfaces/TestInstanceResultSetConclusion";
import { BrowserEnum } from "@modules/runner/interface";
import { BuildInstanceResults } from "./mongo/buildInstanceResults";
import { ActionStatusEnum } from "@crusher-shared/lib/runnerLog/interface";

// Diff delta percent should be lower than 0.05 to be considered as pass
const DIFF_DELTA_PASS_THRESHOLD = 0.05;
// Diff delta percent above 5% means marking it as failed
const DIFF_DELTA_FAILED_THRESHOLD = 5;

export type IVisualDiffResultWithConclusion = IVisualDiffResult & { status: TestInstanceResultStatusEnum };
@Service()
class BuildTestInstancesService {
	@Inject()
	private dbManager: DBManager;
	@Inject()
	private visualDiffService: VisualDiffService;
	@Inject()
	private buildTestInstanceScreenshotService: BuildTestInstanceScreenshotService;

	async markRunning(instanceId: number) {
		return this.dbManager.update(`UPDATE test_instances SET status = ? WHERE id = ?`, [TestInstanceStatusEnum.RUNNING, instanceId]);
	}

	logProgress(instanceId: number, logRequestPayload: ILogProgressRequestPayload) {
		// Something
	}

	@CamelizeResponse()
	private async getBuildTestInstanceResultSet(instanceId: number): Promise<KeysToCamelCase<ITestInstanceResultSetsTable> | null> {
		return this.dbManager.fetchSingleRow("SELECT * FROM test_instance_result_sets WHERE instance_id = ?", [instanceId]);
	}

	private getScreenshotStatusFromDiffDelta(diffDelta: number): TestInstanceResultStatusEnum {
		if (diffDelta < DIFF_DELTA_PASS_THRESHOLD) return TestInstanceResultStatusEnum.PASSED;
		else if (diffDelta > DIFF_DELTA_FAILED_THRESHOLD) return TestInstanceResultStatusEnum.FAILED;
		else return TestInstanceResultStatusEnum.MANUAL_REVIEW_REQUIRED;
	}

	private getFailedReasonMessage(isAllVisualDiffPassing: boolean, wasTestExecutionSuccessful: boolean, failedReason: string): string {
		if (!isAllVisualDiffPassing && !wasTestExecutionSuccessful) {
			return failedReason ? `${failedReason} && Visual diffs failed too` : "Some issue occurred during text execution && visual diffs failed too";
		}
		if (!isAllVisualDiffPassing && wasTestExecutionSuccessful) {
			return "One of the visual diff failed";
		}
		if (isAllVisualDiffPassing && !wasTestExecutionSuccessful) {
			return failedReason ? failedReason : "Some issue occurred during test execution";
		}

		// @Note: Should never reach here
		return "Unknown error occurred";
	}

	private calculateResult(
		visualDiffsResult: Array<IVisualDiffResultWithConclusion>,
		wasTestExecutionSuccessful: boolean,
		failedReason: string | null = null,
	): { conclusion: TestInstanceResultSetConclusionEnum; failedReason?: string } {
		const isAllVisualDiffsPassing = visualDiffsResult.every((result) => result.status === TestInstanceResultStatusEnum.PASSED);
		const isAnyVisualDiffFailed = visualDiffsResult.some((result) => result.status === TestInstanceResultStatusEnum.FAILED);

		if (wasTestExecutionSuccessful && isAllVisualDiffsPassing) {
			return { conclusion: TestInstanceResultSetConclusionEnum.PASSED };
		} else if (wasTestExecutionSuccessful && !isAnyVisualDiffFailed) {
			return { conclusion: TestInstanceResultSetConclusionEnum.MANUAL_REVIEW_REQUIRED };
		}

		return {
			conclusion: TestInstanceResultSetConclusionEnum.FAILED,
			failedReason: this.getFailedReasonMessage(isAllVisualDiffsPassing, wasTestExecutionSuccessful, failedReason),
		};
	}

	async insertScrenshotResult(payload: ICreateBuildTestInstanceResultPayload) {
		console.log("SCREENSHOT_INSER_PAYLOAD", payload);
		return this.dbManager.insert(
			"INSERT INTO test_instance_results SET screenshot_id = ?, target_screenshot_id = ?, instance_result_set_id = ?, diff_delta = ?, diff_image_url = ?, status = ?",
			[payload.screenshotId, payload.targetScreenshotId, payload.instanceResultSetId, payload.diffDelta, payload.diffImageUrl, payload.status],
		);
	}

	private async saveActionsResult(actionsResult: Array<IActionResultItemWithIndex>, instanceId: number, projectId: number, hasInstancePassed: boolean) {
		console.log("Trying to save this", actionsResult);
		const buildInstanceResult = new BuildInstanceResults({
			instanceId: instanceId,
			projectId: projectId,
			actionsResult: actionsResult,
			hasInstancePassed: hasInstancePassed,
		});

		return buildInstanceResult.save();
	}

	async saveResult(
		actionsResult: Array<IActionResultItemWithIndex>,
		savedScreenshotRecords: Array<ISavedActionResultItemWithIndex>,
		instanceId: number,
		projectId: number,
		assetIdentifer: string,
		wasTestExecutionSuccessful: boolean,
	) {
		await this.updateResultSetStatus(TestInstanceResultSetStatusEnum.RUNNING_CHECKS, null, instanceId);

		const buildTestInstanceResultSet = await this.getBuildTestInstanceResultSet(instanceId);

		const referenceScreenshots = await this.buildTestInstanceScreenshotService.getScreenshots(buildTestInstanceResultSet.targetInstanceId);
		const referenceScreenshotsMap: { [key: string]: KeysToCamelCase<ITestInstanceScreenshotsTable> } = referenceScreenshots.reduce((acc, refScreenshot) => {
			return { ...acc, [refScreenshot.actionIndex]: refScreenshot };
		}, {});

		const visualDiffResultsPromiseArr = savedScreenshotRecords.map((screenshotResult) => {
			const baseImage = screenshotResult.meta.outputs[0];
			const referenceImageRecord = referenceScreenshotsMap[screenshotResult.actionIndex];

			const referenceImage = {
				name: referenceImageRecord.name,
				value: referenceImageRecord.url,
			};

			return this.visualDiffService
				.getDiffResult(baseImage.value, referenceImage.value, path.join(assetIdentifer, `${baseImage.name}_${referenceImage.name}_diff.png`))
				.then(async (diffResult) => {
					await this.insertScrenshotResult({
						screenshotId: screenshotResult.recordId,
						targetScreenshotId: referenceImageRecord.id,
						instanceResultSetId: buildTestInstanceResultSet.id,
						diffDelta: diffResult.diffDelta,
						diffImageUrl: diffResult.outputDiffImageUrl,
						status: this.getScreenshotStatusFromDiffDelta(diffResult.diffDelta),
					});

					return {
						...diffResult,
						resultId: 0,
						status: this.getScreenshotStatusFromDiffDelta(diffResult.diffDelta),
					};
				});
		});

		const visualDiffsResult = await Promise.all(visualDiffResultsPromiseArr);
		const finalTestResult = this.calculateResult(visualDiffsResult, wasTestExecutionSuccessful);

		await this.saveActionsResult(actionsResult, instanceId, projectId, finalTestResult.conclusion === TestInstanceResultSetConclusionEnum.PASSED);

		return this.updateResultSetStatus(
			TestInstanceResultSetStatusEnum.FINISHED_RUNNING_CHECKS,
			finalTestResult.conclusion,
			instanceId,
			finalTestResult.failedReason,
		);
	}

	private async updateResultSetStatus(
		status: TestInstanceResultSetStatusEnum,
		conclusion: TestInstanceResultSetConclusionEnum,
		instanceId: number,
		failedReason: string | null = null,
	) {
		return this.dbManager.update("UPDATE test_instance_result_sets SET status = ?, conclusion = ?, failed_reason = ? WHERE instance_id = ?", [
			status,
			conclusion,
			failedReason,
			instanceId,
		]);
	}

	markResultFailed(failedReason: string, instanceId: number) {
		return this.updateResultSetStatus(
			TestInstanceResultSetStatusEnum.FINISHED_RUNNING_CHECKS,
			TestInstanceResultSetConclusionEnum.FAILED,
			instanceId,
			failedReason,
		);
	}

	@CamelizeResponse()
	getResultSets(reportId: number): Promise<Array<KeysToCamelCase<ITestInstanceResultSetsTable>>> {
		return this.dbManager.fetchAllRows("SELECT * FROM test_instance_result_sets WHERE report_id = ?", [reportId]);
	}

	async createBuildTestInstanceResultSet(
		payload: KeysToCamelCase<Omit<ITestInstanceResultSetsTable, "id" | "status" | "conclusion" | "failed_reason">>,
	): Promise<{ insertId: number }> {
		return this.dbManager.insert("INSERT INTO test_instance_result_sets SET report_id = ?, instance_id = ?, target_instance_id = ?, status = ?", [
			payload.reportId,
			payload.instanceId,
			payload.targetInstanceId,
			TestInstanceResultSetStatusEnum.WAITING_FOR_TEST_EXECUTION,
		]);
	}

	async createBuildTestInstance(
		payload: KeysToCamelCase<Omit<ITestInstancesTable, "id" | "browser" | "status" | "code">> & { browser: Omit<BrowserEnum, "ALL"> },
	): Promise<{ insertId: number }> {
		return this.dbManager.insert("INSERT INTO test_instances SET job_id = ?, test_id = ?, status = ?, host = ?, browser = ?", [
			payload.jobId,
			payload.testId,
			TestInstanceStatusEnum.QUEUED,
			payload.host,
			payload.browser,
		]);
	}

	@CamelizeResponse()
	async getInstance(instanceId: number): Promise<KeysToCamelCase<ITestInstancesTable>> {
		return this.dbManager.fetchSingleRow("SELECT * FROM test_instances WHERE id = ?", [instanceId]);
	}

	async addRecordedVideo(videoUrl: string, instanceId: number) {
		return this.dbManager.fetchSingleRow("UPDATE test_instances SET recorded_video_url = ? WHERE id = ?", [videoUrl, instanceId]);
	}

	@CamelizeResponse()
	async getReferenceInstance(testInstanceId: number, referenceType: "PROJECT_LEVEL" | null = "PROJECT_LEVEL"): Promise<KeysToCamelCase<ITestInstancesTable>> {
		const testRecord = await this.dbManager.fetchSingleRow(
			"SELECT tests.* FROM test_instances, tests WHERE test_instances.id = ? AND tests.id = test_instances.test_id",
			[testInstanceId],
		);
		const testInstanceRecord = await this.getInstance(testInstanceId);
		if (!referenceType) {
			throw new Error("No valid reference type specified");
		}

		// Currently there is only one reference type
		const projectRecord = await this.dbManager.fetchSingleRow("SELECT * FROM projects WHERE id = ?", [testRecord.project_id]);
		if (!projectRecord.baseline_job_id) return testInstanceRecord;

		const projectLevelReferenceInstance = await this.dbManager.fetchSingleRow(
			"SELECT * FROM test_instances WHERE test_id = ? AND job_id = ? AND browser = ?",
			[testRecord.id, projectRecord.baseline_job_id, testInstanceRecord.browser],
		);
		return projectLevelReferenceInstance ? projectLevelReferenceInstance : testInstanceRecord;
	}
}

export { BuildTestInstancesService };
