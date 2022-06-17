import { Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import { JobReportStatus } from "@crusher-shared/types/jobReportStatus";
import { PLATFORM } from "@crusher-shared/types/platform";
import { iAction } from "@crusher-shared/types/action";
import { IBuildReportResponse } from "@crusher-shared/types/response/iBuildReportResponse";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { BuildTestInstancesService } from "../builds/instances/service";
import {
	IBuildTestInstanceResultsTable,
	TestInstanceResultSetConclusionEnum,
	TestInstanceResultSetStatusEnum,
	TestInstanceResultStatusEnum,
} from "../builds/instances/interface";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { BuildReportStatusEnum, IBuildReportTable, TestInstanceResultSetConclusion, TestInstanceResultSetStatus } from "./interface";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { BuildTestInstanceScreenshotService } from "../builds/instances/screenshots.service";
import { ActionStatusEnum } from "@crusher-shared/lib/runnerLog/interface";
import { StorageManager } from "@modules/storage";
interface TestBuildReport {
	buildId: number;
	buildMeta: string;
	buildBaselineId: number;
	buildProjectId: number;
	buildReportId: number;
	buildName: string;
	buildCreatedAt: string;
	buildReportCreatedAt: string;
	buildReportStatus: JobReportStatus;
	buildReportUpdatedAt: string;
	buildUpdatedAt: string;

	// Test Data
	testId?: number;
	testBuildReportId?: number;
	testInstanceId?: number;
	testBaselineInstanceId?: number;
	testName?: string;
	testStepsJson?: string;
	testInstanceBrowser?: PLATFORM;
	testInstanceHost?: string;
	testResultStatus?: TestInstanceResultSetStatus;
	testResultConclusion?: TestInstanceResultSetConclusion;
	testResultSetId?: number;
	testInstanceGroupId?: number | null;
	testInstanceContext?: any;
	testInstanceMeta?: string;
	recordedVideoUrl?: string;
}

@Service()
export class BuildReportService {
	@Inject()
	private dbManager: DBManager;
	@Inject()
	private buildTestInstanceService: BuildTestInstancesService;
	@Inject()
	private buildTestInstanceScreenshotService: BuildTestInstanceScreenshotService;
	@Inject()
	private storageManager: StorageManager;

	private async getPublicUrl(url: string) {
		if (!url) return null;
		return url.startsWith("http") ? url : await this.storageManager.getUrl(url);
	}

	private async getInstanceResultWithDiffComparision(
		actionResults: Array<any>,
		instanceScreenshotsRecords: Array<KeysToCamelCase<IBuildTestInstanceResultsTable> & { actionIndex: number; targetScreenshotUrl: string }>,
	) {
		const instanceScreenshotsRecordsMap: {
			[key: string]: KeysToCamelCase<IBuildTestInstanceResultsTable> & { actionIndex: number; targetScreenshotUrl: string; currentScreenshotUrl: string };
		} = instanceScreenshotsRecords.reduce((prev, current) => {
			return { ...prev, [current.actionIndex]: current };
		}, {});

		// @TODO: Cleanup tihs logic and use proper typescript types
		return await Promise.all(
			actionResults.map(async (actionResult, actionIndex) => {
				if (
					[ActionsInTestEnum.ELEMENT_SCREENSHOT, ActionsInTestEnum.PAGE_SCREENSHOT, ActionsInTestEnum.CUSTOM_CODE].includes(actionResult.actionType)
				) {
					if (!actionResult.meta || !actionResult.meta.outputs) return actionResult;

					const images = actionResult.meta.outputs;
					for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
						const screenshotResultRecord = instanceScreenshotsRecordsMap[`${actionIndex}.${imageIndex}`];
						if (actionResult.meta && actionResult.meta.outputs && actionResult.meta.outputs.length && screenshotResultRecord) {
							if (screenshotResultRecord.status === TestInstanceResultStatusEnum.MANUAL_REVIEW_REQUIRED) {
								actionResult.status = ActionStatusEnum.MANUAL_REVIEW_REQUIRED;
							} else if (screenshotResultRecord.status === TestInstanceResultStatusEnum.FAILED) {
								actionResult.status = ActionStatusEnum.FAILED;
							}
							actionResult.meta.outputs[imageIndex].status = screenshotResultRecord.status;

							actionResult.meta.outputs[imageIndex].value = await this.getPublicUrl(screenshotResultRecord.currentScreenshotUrl);
							actionResult.meta.outputs[imageIndex].diffImageUrl = await this.getPublicUrl(screenshotResultRecord.diffImageUrl);
							actionResult.meta.outputs[imageIndex].targetScreenshotUrl = await this.getPublicUrl(screenshotResultRecord.targetScreenshotUrl);
							actionResult.meta.outputs[imageIndex].diffDelta = screenshotResultRecord.diffDelta;
							actionResult.meta.outputs[imageIndex].index = `${actionIndex}.${imageIndex}`;
						}
					}
				}

				if (actionResult.status === ActionStatusEnum.FAILED) {
					if (actionResult.meta && actionResult.meta.screenshotDuringError) {
						actionResult.meta.screenshotDuringError = JSON.parse(actionResult.meta.screenshotDuringError || {});
						if (actionResult.meta.screenshotDuringError.startingScreenshot) {
							actionResult.meta.screenshotDuringError.startingScreenshot = await this.getPublicUrl(
								actionResult.meta.screenshotDuringError.startingScreenshot,
							);
						}
						if (actionResult.meta.screenshotDuringError.endingScreenshot) {
							actionResult.meta.screenshotDuringError.endingScreenshot = await this.getPublicUrl(
								actionResult.meta.screenshotDuringError.endingScreenshot,
							);
						}
					}
				}

				return actionResult;
			}),
		);
	}

	async getBuildReport(buildId: number): Promise<IBuildReportResponse> {
		const testsWithReportData: Array<TestBuildReport> = await this.dbManager.fetchAllRows(
			"SELECT jobs.id build_id, jobs.meta build_meta, jobs.project_id build_project_id, jobs.commit_name build_name, job_reports.id build_report_id, job_reports.reference_job_id build_baseline_id, job_reports.created_at build_report_created_at, jobs.created_at build_created_at, jobs.updated_at build_updated_at, job_reports.updated_at build_report_updated_at, job_reports.status build_report_status, build_tests.* FROM public.jobs, public.job_reports LEFT JOIN (SELECT test_instances.id test_instance_id, test_instances.meta test_instance_meta, test_instances.group_id test_instance_group_id, test_instances.context test_instance_context, test_instance_result_sets.report_id test_build_report_id, test_instance_result_sets.status test_result_status, test_instance_result_sets.conclusion test_Result_conclusion, test_instance_result_sets.id test_result_set_id, test_instance_result_sets.target_instance_id test_baseline_instance_id, tests.name test_name, test_instances.browser test_instance_browser, tests.id test_id, tests.events test_steps_json, test_instances.host test_instance_host, test_instances.recorded_video_url recorded_video_url FROM public.test_instances, public.tests, public.test_instance_result_sets WHERE  tests.id = test_instances.test_id AND test_instance_result_sets.instance_id = test_instances.id) build_tests ON build_tests.test_build_report_id = job_reports.id WHERE  jobs.id = ? AND job_reports.id = jobs.latest_report_id",
			[buildId],
			true,
		);
		if (!testsWithReportData.length) throw new Error(`No information available about build reports with this build id ${buildId}`);

		const testsWithReportDataAndActionResultsPromises: Array<Promise<TestBuildReport & { actionsResult: Array<any> }>> = testsWithReportData.map(
			async (reportData) => {
				const instanceResult = await this.buildTestInstanceService.getActionsResult(reportData.testInstanceId);

				const instanceScreenshots = await this.buildTestInstanceScreenshotService.getScreenshotResultWithActionIndex(reportData.testResultSetId);

				const finalInstanceResult = instanceResult
					? await this.getInstanceResultWithDiffComparision(instanceResult.actionsResult, instanceScreenshots)
					: null;

				return {
					...reportData,
					actionsResult: finalInstanceResult,
				};
			},
		);

		const testsWithReportDataAndActionResults = await Promise.all(testsWithReportDataAndActionResultsPromises);

		// If no test data is available, testBuildReportId would be null as per the LEFT JOIN
		const testMapArr = await Promise.all(
			testsWithReportDataAndActionResults
				.filter((testReportData) => !!testReportData.testId)
				.map(async (instance) => ({
					...instance,
					recordedVideoUrl: await this.getPublicUrl(instance.recordedVideoUrl),
				})),
		);
		const testsMap = testMapArr.reduce((prev: any, current) => {
			const testInstance = {
				id: current.testInstanceId,
				verboseStatus: current.testResultStatus,
				status: current.testResultConclusion,
				groupId: current.testInstanceGroupId,
				context: current.testInstanceContext || {},
				meta: current.testInstanceMeta && current.testInstanceMeta.length ? JSON.parse(current.testInstanceMeta) : {},
				config: {
					browser: current.testInstanceBrowser,
				},
				// @TODO: Implement logic for this
				output: {
					video: current.recordedVideoUrl,
				},
				steps: current.actionsResult,
			};

			const uniqueId = current.testInstanceGroupId ? `${current.testId}/${current.testInstanceGroupId}` : `${current.testId}`;
			if (prev[uniqueId]) {
				prev[uniqueId].testInstances.push(testInstance);
			} else {
				prev[uniqueId] = {
					testId: current.testId,
					name: current.testName,
					// @TODO: Add this in tests table
					meta: {},
					testInstances: [testInstance],
				};
			}
			return prev;
		}, {});

		const testsArray: Array<any> = Object.values(testsMap);

		return {
			buildId: testsWithReportData[0].buildId,
			buildReportId: testsWithReportData[0].buildReportId,
			id: testsWithReportData[0].buildId,
			name: testsWithReportData[0].buildName,
			startedAt: new Date(testsWithReportData[0].buildReportCreatedAt).getTime(),
			projectId: testsWithReportData[0].buildProjectId,
			baselineId: testsWithReportData[0].buildBaselineId,
			hasNoReferenceBuildToCompare: testsWithReportData[0].buildBaselineId === testsWithReportData[0].buildId,
			status: testsWithReportData[0].buildReportStatus,
			// @TODO: Add implementation for this
			reviewer: [],
			// @TODO: Add implementation for this
			history: [],
			// @TODO: Add implementation for this
			configuration: {
				environment: [],
			},
			meta: testsWithReportData[0].buildMeta ? JSON.parse(testsWithReportData[0].buildMeta) : {},
			tests: testsArray,
			// @TODO: Add implementation for this
			comments: [],
		};
	}

	private getFinalBuildResult(
		totalTestCount: number,
		passedTestCount: number,
		failedTestCount: number,
		reviewRequiredTestCount: number,
	): BuildReportStatusEnum {
		if (totalTestCount === passedTestCount) {
			return BuildReportStatusEnum.PASSED;
		} else if (failedTestCount === 0 && reviewRequiredTestCount) {
			return BuildReportStatusEnum.MANUAL_REVIEW_REQUIRED;
		}

		return BuildReportStatusEnum.FAILED;
	}

	private saveReportResult(
		reportId: number,
		passedTestCount: number,
		failedTestCount: number,
		reviewRequiredTestCount: number,
		status: string,
		statusExplanation = "",
	) {
		return this.dbManager.update(
			"UPDATE public.job_reports SET passed_test_count = ?, failed_test_count = ?, review_required_test_count = ?, status = ?, status_explanation = ? WHERE id = ?",
			[passedTestCount, failedTestCount, reviewRequiredTestCount, status, statusExplanation, reportId],
		);
	}

	async calculateResultAndSave(reportId: number, totalTestCount: number): Promise<BuildReportStatusEnum> {
		const testInstancesResultsInReport = await this.buildTestInstanceService.getResultSets(reportId);
		const haveAllTestInstanceCompletedChecks = testInstancesResultsInReport.every(
			(result) => result.status === TestInstanceResultSetStatusEnum.FINISHED_RUNNING_CHECKS,
		);
		if (!haveAllTestInstanceCompletedChecks) throw new Error("Not every test have finished performing checks");

		const passedTestCount = testInstancesResultsInReport.filter((result) => result.conclusion === TestInstanceResultSetConclusionEnum.PASSED).length;
		const failedTestCount = testInstancesResultsInReport.filter((result) => result.conclusion === TestInstanceResultSetConclusionEnum.FAILED).length;
		const reviewRequiredTestCount = testInstancesResultsInReport.filter(
			(result) => result.conclusion === TestInstanceResultSetConclusionEnum.MANUAL_REVIEW_REQUIRED,
		).length;

		const finalBuildReportResult = this.getFinalBuildResult(totalTestCount, passedTestCount, failedTestCount, reviewRequiredTestCount);

		// @TODO: Add proper explanation for here (Will help in debugging in case test fails)
		await this.saveReportResult(reportId, passedTestCount, failedTestCount, reviewRequiredTestCount, finalBuildReportResult, "Unknown");

		return finalBuildReportResult;
	}

	async incrementBuildReportTotalCount(incrementOffset: number, reportId: number) {
		return this.dbManager.update("UPDATE public.job_reports SET total_test_count = total_test_count + ? WHERE id = ?", [incrementOffset, reportId]);
	}

	async createBuildReport(totalTestCount: number, buildId: number, referenceBuildId: number, projectId: number): Promise<{ insertId: number }> {
		return this.dbManager.insert(`INSERT INTO public.job_reports (job_id, reference_job_id, total_test_count, project_id, status) VALUES (?, ?, ?, ?, ?)`, [
			buildId,
			referenceBuildId,
			totalTestCount,
			projectId,
			BuildReportStatusEnum.RUNNING,
		]);
	}

	@CamelizeResponse()
	async getBuildReportRecord(reportId: number): Promise<KeysToCamelCase<IBuildReportTable> | null> {
		return this.dbManager.fetchSingleRow("SELECT * FROM public.job_reports WHERE id = ?", [reportId]);
	}

	async approveBuildReport(reportId: number) {
		return this.dbManager.update("UPDATE public.job_reports SET status = ? WHERE id = ?", [JobReportStatus.PASSED, reportId]);
	}
}
