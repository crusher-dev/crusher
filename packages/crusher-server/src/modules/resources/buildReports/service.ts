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
import { BuildInstanceResults, IBuildInstanceResult } from "../builds/instances/mongo/buildInstanceResults";
import { BuildTestInstanceScreenshotService } from "../builds/instances/screenshots.service";
import { ActionStatusEnum } from "@crusher-shared/lib/runnerLog/interface";

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
	testStepsJSON?: string;
	testInstanceBrowser?: PLATFORM;
	testInstanceHost?: string;
	testResultStatus?: TestInstanceResultSetStatus;
	testResultConclusion?: TestInstanceResultSetConclusion;
	testResultSetId?: number;
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

	private getInstanceResultWithDiffComparision(
		actionResults: Array<any>,
		instanceScreenshotsRecords: Array<KeysToCamelCase<IBuildTestInstanceResultsTable> & { actionIndex: number; targetScreenshotUrl: string }>,
	) {
		const instanceScreenshotsRecordsMap: {
			[key: string]: KeysToCamelCase<IBuildTestInstanceResultsTable> & { actionIndex: number; targetScreenshotUrl: string; currentScreenshotUrl: string };
		} = instanceScreenshotsRecords.reduce((prev, current) => {
			return { ...prev, [current.actionIndex]: current };
		}, {});

		// @TODO: Cleanup tihs logic and use proper typescript types
		return actionResults.map((actionResult, actionIndex) => {
			if ([ActionsInTestEnum.ELEMENT_SCREENSHOT, ActionsInTestEnum.PAGE_SCREENSHOT, ActionsInTestEnum.CUSTOM_CODE].includes(actionResult.actionType)) {
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

						actionResult.meta.outputs[imageIndex].value = screenshotResultRecord.currentScreenshotUrl;
						actionResult.meta.outputs[imageIndex].diffImageUrl = screenshotResultRecord.diffImageUrl;
						actionResult.meta.outputs[imageIndex].targetScreenshotUrl = screenshotResultRecord.targetScreenshotUrl;
						actionResult.meta.outputs[imageIndex].diffDelta = screenshotResultRecord.diffDelta;
						actionResult.meta.outputs[imageIndex].index = `${actionIndex}.${imageIndex}`;
					}
				}
			}

			return actionResult;
		});
	}

	async getBuildReport(buildId: number): Promise<IBuildReportResponse> {
		const testsWithReportData: Array<TestBuildReport> = await this.dbManager.fetchAllRows(
			"SELECT jobs.id buildId, jobs.meta buildMeta, jobs.project_id buildProjectId, jobs.commit_name buildName, job_reports.id buildReportId, job_reports.reference_job_id buildBaselineId, job_reports.created_at buildReportCreatedAt, jobs.created_at buildCreatedAt, jobs.updated_at buildUpdatedAt, job_reports.updated_at buildReportUpdatedAt, job_reports.status buildReportStatus, buildTests.* FROM jobs, job_reports LEFT JOIN (SELECT test_instances.id testInstanceId, test_instance_result_sets.report_id testBuildReportId, test_instance_result_sets.status testResultStatus, test_instance_result_sets.conclusion testResultConclusion, test_instance_result_sets.id testResultSetId, test_instance_result_sets.target_instance_id testBaselineInstanceId, tests.name testName, test_instances.browser testInstanceBrowser, tests.id testId, tests.events testStepsJSON, test_instances.host testInstanceHost, test_instances.recorded_video_url recordedVideoUrl FROM test_instances, tests, test_instance_result_sets WHERE  tests.id = test_instances.test_id AND test_instance_result_sets.instance_id = test_instances.id) buildTests ON buildTests.testBuildReportId = job_reports.id WHERE  jobs.id = ? AND job_reports.id = jobs.latest_report_id",
			[buildId],
		);
		if (!testsWithReportData.length) throw new Error(`No information available about build reports with this build id ${buildId}`);

		const testsWithReportDataAndActionResultsPromises: Array<Promise<TestBuildReport & { actionsResult: Array<any> }>> = testsWithReportData.map(
			async (reportData) => {
				const instanceResult = await BuildInstanceResults.findOne({
					instanceId: { $eq: reportData.testInstanceId },
				}).exec();

				const instanceScreenshots = await this.buildTestInstanceScreenshotService.getScreenshotResultWithActionIndex(reportData.testResultSetId);

				const finalInstanceResult = instanceResult
					? this.getInstanceResultWithDiffComparision(instanceResult.actionsResult, instanceScreenshots)
					: null;

				return {
					...reportData,
					actionsResult: finalInstanceResult,
				};
			},
		);

		const testsWithReportDataAndActionResults = await Promise.all(testsWithReportDataAndActionResultsPromises);

		// If no test data is available, testBuildReportId would be null as per the LEFT JOIN
		const testsMap = testsWithReportDataAndActionResults
			.filter((testReportData) => !!testReportData.testId)
			.reduce((prev: any, current) => {
				const testInstance = {
					id: current.testInstanceId,
					verboseStatus: current.testResultStatus,
					status: current.testResultConclusion,
					config: {
						browser: current.testInstanceBrowser,
					},
					// @TODO: Implement logic for this
					output: {
						video: current.recordedVideoUrl,
					},
					steps: current.actionsResult,
				};

				if (prev[current.testId]) {
					prev[current.testId].testInstances.push(testInstance);
				} else {
					prev[current.testId] = {
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
			"UPDATE job_reports SET passed_test_count = ?, failed_test_count = ?, review_required_test_count = ?, status = ?, status_explanation = ? WHERE id = ?",
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

	async createBuildReport(totalTestCount: number, buildId: number, referenceBuildId: number, projectId: number): Promise<{ insertId: number }> {
		return this.dbManager.insert(`INSERT INTO job_reports SET job_id = ?, reference_job_id = ?, total_test_count = ?, project_id = ?, status = ?`, [
			buildId,
			referenceBuildId,
			totalTestCount,
			projectId,
			BuildReportStatusEnum.RUNNING,
		]);
	}

	@CamelizeResponse()
	async getBuildReportRecord(reportId: number): Promise<KeysToCamelCase<IBuildReportTable> | null> {
		return this.dbManager.fetchSingleRow("SELECT * FROM job_reports WHERE id = ?", [reportId]);
	}

	async approveBuildReport(reportId: number) {
		return this.dbManager.update("UPDATE job_reports SET status = ? WHERE id = ?", [JobReportStatus.PASSED, reportId]);
	}
}
