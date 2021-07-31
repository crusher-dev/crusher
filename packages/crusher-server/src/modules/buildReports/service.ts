import { Inject, Service } from "typedi";
import DBManager from "@manager/DBManager";
import { JobReportStatus } from "@crusher-shared/types/jobReportStatus";
import { PLATFORM } from "@crusher-shared/types/platform";
import { TestInstanceResultSetStatus } from "../../core/interfaces/TestInstanceResultSetStatus";
import { TestInstanceResultSetConclusion } from "../../core/interfaces/TestInstanceResultSetConclusion";
import { iAction } from "@crusher-shared/types/action";
import { IBuildReportResponse } from "@crusher-shared/types/response/iBuildReportResponse";

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
}

@Service()
export class BuildReportService {
	@Inject()
	private dbManager: DBManager;

	async getBuildReport(buildId: number): Promise<IBuildReportResponse> {
		const testsWithReportData: Array<TestBuildReport> = await this.dbManager.fetchData(
			"SELECT jobs.id buildId, jobs.meta buildMeta, jobs.project_id buildProjectId, jobs.commit_name buildName, job_reports.id buildReportId, job_reports.reference_job_id buildBaselineId, job_reports.created_at buildReportCreatedAt, jobs.created_at buildCreatedAt, jobs.updated_at buildUpdatedAt, job_reports.updated_at buildReportUpdatedAt, job_reports.status buildReportStatus, buildTests.* FROM jobs, job_reports LEFT JOIN (SELECT test_instances.id testInstanceId, test_instance_result_sets.report_id testBuildReportId, test_instance_result_sets.status testResultStatus, test_instance_result_sets.conclusion testResultConclusion, test_instance_result_sets.target_instance_id testBaselineInstanceId, tests.name testName, test_instances.platform testInstanceBrowser, tests.id testId, tests.events testStepsJSON, test_instances.host testInstanceHost FROM test_instances, tests, test_instance_result_sets WHERE  tests.id = test_instances.test_id AND test_instance_result_sets.instance_id = test_instances.id) buildTests ON buildTests.testBuildReportId = job_reports.id WHERE  jobs.id = ? AND job_reports.id = jobs.latest_report_id",
			[buildId],
		);
		if (!testsWithReportData.length) throw new Error(`No information available about build reports with this build id ${buildId}`);

		// If no test data is available, testBuildReportId would be null as per the LEFT JOIN
		const testsMap = testsWithReportData
			.filter((testReportData) => !!testReportData.testId)
			.reduce((prev: any, current) => {
				const steps: Array<iAction> = current.testStepsJSON ? JSON.parse(current.testStepsJSON) : [];

				const finalStepsFormat = steps.map((step, index) => {
					return {
						// @TODO: This has to be replaces for an identifier
						index: index,
						stepType: step.type,
						// @TODO: Need a real more-readable description of action types
						description: step.type
							.split("_")
							.map((word) => {
								if (word.length) return word[0].toUpperCase() + word[0].slice(1);
								return null;
							})
							.filter((word) => word !== null)
							.join(" "),
						status: current.testResultStatus,
						payload: {
							message: step.payload,
						},
					};
				});

				const testInstance = {
					id: current.testInstanceId,
					verboseStatus: current.testResultStatus,
					status: current.testResultConclusion,
					config: {
						browser: current.testInstanceBrowser,
					},
					// @TODO: Implement logic for this
					output: {
						video: "https://www.w3schools.com/html/mov_bbb.mp4",
						images: [
							{
								id: 120,
								url: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
								baselineURL: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
								diffDelta: 0,
								diffURL: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
							},
						],
					},
					steps: finalStepsFormat,
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
			id: testsWithReportData[0].buildId,
			name: testsWithReportData[0].buildName,
			// @TODO: Need to use a single timezone to calculate epoch time
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
}
