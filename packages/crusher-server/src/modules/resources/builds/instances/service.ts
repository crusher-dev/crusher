import { Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import {
	IBuildInstanceActionResults,
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
import { VisualDiffService } from "@modules/visualDiff";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { BuildTestInstanceScreenshotService } from "./screenshots.service";
import * as path from "path";
import { IVisualDiffResult } from "@modules/visualDiff/interface";
import { BrowserEnum } from "@modules/runner/interface";
import { ProjectsService } from "@modules/resources/projects/service";
import { StorageManager } from "@modules/storage";
import { ActionStatusEnum } from "@crusher-shared/lib/runnerLog/interface";

// Diff delta percent should be lower than 0.05 to be considered as pass
const DIFF_DELTA_PASS_THRESHOLD = 0.25;
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
	private projectsService: ProjectsService;

	@Inject()
	private buildTestInstanceScreenshotService: BuildTestInstanceScreenshotService;

	@Inject()
	private storageManager: StorageManager;

	async markRunning(instanceId: number) {
		return this.dbManager.update(`UPDATE public.test_instances SET status = ? WHERE id = ?`, [TestInstanceStatusEnum.RUNNING, instanceId]);
	}

	logProgress(instanceId: number, logRequestPayload: ILogProgressRequestPayload) {
		// Something
	}

	@CamelizeResponse()
	private async getBuildTestInstanceResultSet(instanceId: number): Promise<KeysToCamelCase<ITestInstanceResultSetsTable> | null> {
		return this.dbManager.fetchSingleRow("SELECT * FROM public.test_instance_result_sets WHERE instance_id = ?", [instanceId]);
	}

	private getScreenshotStatusFromDiffDelta(diffDelta: number, projectVisualBaseline: number): TestInstanceResultStatusEnum {
		// @TODO: Discuss if tests should fail because of visual diffs
		if (diffDelta < projectVisualBaseline) return TestInstanceResultStatusEnum.PASSED;
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
		return this.dbManager.insert(
			"INSERT INTO public.test_instance_results (screenshot_id, target_screenshot_id, instance_result_set_id, diff_delta, diff_image_url, status) VALUES (?, ?, ?, ?, ?, ?)",
			[payload.screenshotId, payload.targetScreenshotId, payload.instanceResultSetId, payload.diffDelta, payload.diffImageUrl, payload.status],
		);
	}

	private async saveActionsResult(actionsResult: Array<IActionResultItemWithIndex>, instanceId: number, projectId: number, hasInstancePassed: boolean) {
		return this.dbManager.insert(
			"INSERT INTO public.test_instance_action_results (instance_id, project_id, actions_result, has_instance_passed) VALUES (?, ?, ?, ?)",
			[instanceId, projectId, JSON.stringify(actionsResult), hasInstancePassed],
		);
	}

	@CamelizeResponse()
	async getActionsResult(instanceId: number): Promise<KeysToCamelCase<IBuildInstanceActionResults> & { actionsResult: any }> {
		return this.dbManager.fetchSingleRow("SELECT * FROM public.test_instance_action_results WHERE instance_id = ?", [instanceId]);
	}

	@CamelizeResponse()
	async getActionsResultAll(instanceIds: Array<number>): Promise<Array<KeysToCamelCase<IBuildInstanceActionResults> & { actionsResult: any }>> {
		const params = [];
		const inStr = new Array(instanceIds.length).fill("?").join(",");
		for(let instanceId of instanceIds) {
			params.push(instanceId);
		}
		return this.dbManager.fetchAllRows(`SELECT * FROM public.test_instance_action_results WHERE instance_id IN (${inStr})`, [...params]);
	}

	async saveResult(
		actionsResult: Array<IActionResultItemWithIndex>,
		savedScreenshotRecords: Array<ISavedActionResultItemWithIndex>,
		instanceId: number,
		projectId: number,
		assetIdentifer: string,
		wasTestExecutionSuccessful: boolean,
		isStalled: boolean = false,
		harUrl: string | null = null,
	) {
		await this.updateResultSetStatus(TestInstanceResultSetStatusEnum.RUNNING_CHECKS, null, instanceId);

		if(harUrl) {
			await this.dbManager.update("UPDATE public.test_instances SET har_url = ? WHERE id = ?", [harUrl, instanceId]);
		}
		
		const buildTestInstanceResultSet = await this.getBuildTestInstanceResultSet(instanceId);
		const project = await this.projectsService.getProject(projectId);

		const referenceScreenshots = await this.buildTestInstanceScreenshotService.getScreenshots(buildTestInstanceResultSet.targetInstanceId);
		const currentScreenshots = await this.buildTestInstanceScreenshotService.getScreenshots(instanceId);

		const instanceScreenshotsMap: { [key: string]: KeysToCamelCase<ITestInstanceScreenshotsTable> } = currentScreenshots.reduce((acc, refScreenshot) => {
			return { ...acc, [refScreenshot.actionIndex]: refScreenshot };
		}, {});

		const referenceScreenshotsMap: { [key: string]: KeysToCamelCase<ITestInstanceScreenshotsTable> } = referenceScreenshots.reduce((acc, refScreenshot) => {
			return { ...acc, [refScreenshot.actionIndex]: refScreenshot };
		}, {});

		const visualDiffResultsPromiseArr = savedScreenshotRecords.map(async (screenshotResult) => {
			const baseImageRecord = instanceScreenshotsMap[screenshotResult.screenshotIndex];
			const referenceImageRecord = referenceScreenshotsMap[screenshotResult.screenshotIndex];

			const baseImage = {
				name: baseImageRecord.name,
				value: baseImageRecord.url,
			};

			const referenceImage = {
				name: referenceImageRecord ? referenceImageRecord.name : baseImage.name,
				value: referenceImageRecord ? referenceImageRecord.url : baseImage.value,
			};

			let diffResult: { diffDeltaFactor: number; diffDelta: number; outputDiffImageUrl: string } | null = null;
			let diffResultStatus: TestInstanceResultStatusEnum | null = null;
			try {
				diffResult = await this.visualDiffService.getDiffResult(
					await this.storageManager.getUrl(baseImage.value),
					await this.storageManager.getUrl(referenceImage.value),
					path.join("00_folder_7_day_expiration/", assetIdentifer, `${baseImage.name}_${referenceImage.name}_diff.jpeg`),
				);
			} catch (err) {
				console.error("Error is", err);
				diffResult = {
					diffDeltaFactor: 100, // <- Ignore this
					diffDelta: 100,
					outputDiffImageUrl: "https://www.rescuedigitalmedia.com/wp-content/uploads/2018/10/fix-invalid-image-error.png",
				};
				diffResultStatus = TestInstanceResultStatusEnum.FAILED;
				console.error(err);
			}

			await this.insertScrenshotResult({
				screenshotId: screenshotResult.recordId,
				targetScreenshotId: referenceImageRecord ? referenceImageRecord.id : screenshotResult.recordId,
				instanceResultSetId: buildTestInstanceResultSet.id,
				diffDelta: diffResult.diffDelta,
				diffImageUrl: diffResult.outputDiffImageUrl,
				status: this.getScreenshotStatusFromDiffDelta(diffResult.diffDelta, project.visualBaseline),
			});

			return {
				...diffResult,
				resultId: 0,
				status: diffResultStatus ? diffResultStatus : this.getScreenshotStatusFromDiffDelta(diffResult.diffDelta, project.visualBaseline),
			};
		});

		const visualDiffsResult = await Promise.all(visualDiffResultsPromiseArr);
		const finalTestResult = this.calculateResult(visualDiffsResult, wasTestExecutionSuccessful);
		const isThereStalledAction = actionsResult.some((actionResult) => {
			return actionResult.status === ActionStatusEnum.STALLED;
		});
		await this.saveActionsResult(actionsResult, instanceId, projectId, finalTestResult.conclusion === TestInstanceResultSetConclusionEnum.PASSED);

		return this.updateResultSetStatus(
			TestInstanceResultSetStatusEnum.FINISHED_RUNNING_CHECKS,
			isThereStalledAction
				? finalTestResult.conclusion === TestInstanceResultSetConclusionEnum.PASSED
					? TestInstanceResultSetConclusionEnum.PASSED
					: finalTestResult.conclusion
				: finalTestResult.conclusion,
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
		return this.dbManager.update("UPDATE public.test_instance_result_sets SET status = ?, conclusion = ?, failed_reason = ? WHERE instance_id = ?", [
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
		return this.dbManager.fetchAllRows("SELECT * FROM public.test_instance_result_sets WHERE report_id = ?", [reportId]);
	}

	async createBuildTestInstanceResultSet(
		payload: KeysToCamelCase<Omit<ITestInstanceResultSetsTable, "id" | "status" | "conclusion" | "failed_reason">>,
	): Promise<{ insertId: number }> {
		return this.dbManager.insert("INSERT INTO public.test_instance_result_sets (report_id, instance_id, target_instance_id, status) VALUES (?, ?, ?, ?)", [
			payload.reportId,
			payload.instanceId,
			payload.targetInstanceId,
			TestInstanceResultSetStatusEnum.WAITING_FOR_TEST_EXECUTION,
		]);
	}

	async createBuildTestInstance(
		payload: KeysToCamelCase<Omit<ITestInstancesTable, "id" | "browser" | "status" | "code" | "meta" | "context">> & {
			browser: Omit<BrowserEnum, "ALL">;
			meta: any;
		},
		context: any = {},
	): Promise<{ insertId: number }> {
		return this.dbManager.insert(
			"INSERT INTO public.test_instances (job_id, test_id, status, host, browser, meta, context, group_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
			[
				payload.jobId,
				payload.testId,
				TestInstanceStatusEnum.QUEUED,
				payload.host,
				payload.browser,
				payload.meta ? JSON.stringify(payload.meta) : null,
				context ? JSON.stringify(context) : null,
				payload.groupId || null,
			],
		);
	}

	@CamelizeResponse()
	async getInstanceAllInformation(instanceId: number): Promise<KeysToCamelCase<ITestInstancesTable & { test_name: string; test_events: string }>> {
		return this.dbManager.fetchSingleRow(
			"SELECT test_instances.*, tests.name test_name, tests.events test_events FROM public.test_instances inner join public.tests on tests.id = test_instances.test_id  WHERE test_instances.id = ?",
			[instanceId],
		);
	}

	@CamelizeResponse()
	async getInstance(instanceId: number): Promise<KeysToCamelCase<ITestInstancesTable>> {
		return this.dbManager.fetchSingleRow("SELECT * FROM public.test_instances WHERE id = ?", [instanceId]);
	}

	async addRecordedVideo(videoUrl: string, lastSecondsClipVideoUrl: string, instanceId: number) {
		return this.dbManager.fetchSingleRow("UPDATE public.test_instances SET recorded_video_url = ?, recorded_clip_video_url = ? WHERE id = ?", [
			videoUrl,
			lastSecondsClipVideoUrl,
			instanceId,
		]);
	}

	@CamelizeResponse()
	async getReferenceInstance(testInstanceId: number, referenceType: "PROJECT_LEVEL" | null = "PROJECT_LEVEL"): Promise<KeysToCamelCase<ITestInstancesTable>> {
		const testRecord = await this.dbManager.fetchSingleRow(
			"SELECT tests.* FROM public.test_instances inner join public.tests on tests.id = test_instances.test_id  WHERE test_instances.id = ?",
			[testInstanceId],
		);
		const testInstanceRecord = await this.getInstance(testInstanceId);
		if (!referenceType) {
			throw new Error("No valid reference type specified");
		}

		// Currently there is only one reference type
		const projectRecord = await this.dbManager.fetchSingleRow("SELECT * FROM public.projects WHERE id = ?", [testRecord.project_id]);
		console.log("Project id is", projectRecord);
		if (!projectRecord.baseline_job_id) return testInstanceRecord;

		const projectLevelReferenceInstance = await this.dbManager.fetchSingleRow(
			"SELECT * FROM public.test_instances WHERE test_id = ? AND job_id = ? AND browser = ?",
			[testRecord.id, projectRecord.baseline_job_id, testInstanceRecord.browser],
		);
		return projectLevelReferenceInstance ? projectLevelReferenceInstance : testInstanceRecord;
	}
}

export { BuildTestInstancesService };
