import Container, { Inject, Service } from "typedi";
import { BuildsService } from "@modules/resources/builds/service";
import { ICreateBuildRequestPayload } from "@modules/resources/builds/interface";
import { BrowserEnum, IBuildTaskPayload } from "./interface";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { ITestTable } from "@modules/resources/tests/interface";
import { PLATFORM } from "@crusher-shared/types/platform";
import { QueueManager } from "@modules/queue";
import { TEST_EXECUTION_QUEUE } from "@crusher-shared/constants/queues";
import { ITestExecutionQueuePayload } from "@crusher-shared/types/queues";
import { BuildReportService } from "@modules/resources/buildReports/service";
import { BuildTestInstancesService } from "@modules/resources/builds/instances/service";
import { ITestInstancesTable } from "@modules/resources/builds/instances/interface";
@Service()
class TestsRunner {
	@Inject()
	private buildsService: BuildsService;
	@Inject()
	private buildTestInstanceService: BuildTestInstancesService;
	@Inject()
	private buildReportService: BuildReportService;
	@Inject()
	private queueManager: QueueManager;

	private async addTestRequestToQueue(payload: ITestExecutionQueuePayload) {
		const testExeuctionQueue = await this.queueManager.setupQueue(TEST_EXECUTION_QUEUE);
		return testExeuctionQueue.add(`${payload.buildId}/${payload.testInstanceId}`, payload);
	}

	private async startBuildTask(
		buildTaskInfo: IBuildTaskPayload & { testInstances: Array<KeysToCamelCase<ITestInstancesTable> & { testInfo: KeysToCamelCase<ITestTable> }> },
	) {
		const { testInstances } = buildTaskInfo;
		const addTestInstancePromiseArr = testInstances.map((testInstance) => {
			return this.addTestRequestToQueue({
				actions: JSON.parse(testInstance.testInfo.events),
				config: {
					browser: testInstance.browser as any,
					shouldRecordVideo: buildTaskInfo.config.shouldRecordVideo,
				},
				buildId: buildTaskInfo.buildId,
				testInstanceId: testInstance.id,
				testName: testInstance.testInfo.name,
				buildTestCount: testInstances.length,
			});
		});

		await Promise.all(addTestInstancePromiseArr);
	}

	async runTests(tests: Array<KeysToCamelCase<ITestTable>>, buildPayload: ICreateBuildRequestPayload, baselineBuildId: number = null) {
		const build = await this.buildsService.createBuild(buildPayload);

		if (buildPayload.meta && buildPayload.meta.github) {
			await this.buildsService.initGithubCheckFlow(buildPayload.meta.github, build.insertId);
		}

		const testInstancesArr: Array<KeysToCamelCase<ITestInstancesTable> & { testInfo: KeysToCamelCase<ITestTable> }> = [];
		// Create test instances and store their ids
		const testInitPromiseArr = tests.map(async (test) => {
			const browserArr = buildPayload.browser;

			const testInstanceInitPromiseArr = browserArr.map(async (browser) => {
				const buildInstanceInsertRecord = await this.buildTestInstanceService.createBuildTestInstance({
					jobId: build.insertId,
					testId: test.id,
					// @TODO: Need a proper host here
					host: "null",
					browser: browser,
				});

				return this.buildTestInstanceService.getInstance(buildInstanceInsertRecord.insertId);
			});

			const testInstances = await Promise.all(testInstanceInitPromiseArr);
			for (const testInstance of testInstances) {
				testInstancesArr.push({ ...testInstance, testInfo: test });
			}
		});

		await Promise.all(testInitPromiseArr);

		const referenceBuild = await this.buildsService.getBuild(baselineBuildId ? baselineBuildId : build.insertId);

		const buildReportInsertRecord = await this.buildReportService.createBuildReport(
			tests.length * buildPayload.browser.length,
			build.insertId,
			referenceBuild.id,
			buildPayload.projectId,
		);

		await this.buildsService.updateLatestReportId(buildReportInsertRecord.insertId, build.insertId);

		const testsResultsSetsInsertPromiseArr = testInstancesArr.map(async (testInstance) => {
			const referenceInstance = await this.buildTestInstanceService.getReferenceInstance(testInstance.id);
			return this.buildTestInstanceService.createBuildTestInstanceResultSet({
				reportId: buildReportInsertRecord.insertId,
				instanceId: testInstance.id,
				targetInstanceId: referenceInstance.id,
			});
		});

		await Promise.all(testsResultsSetsInsertPromiseArr);

		const buildInfo = {
			...buildPayload,
			tests: tests,
			isInitialTest: false,
			isVideoOn: true,
			buildId: build.insertId,
		};

		// @TODO: Add implementation to queue the job
		await this.startBuildTask({ ...buildInfo, testInstances: testInstancesArr });

		return { buildId: build.insertId, buildInfo: buildInfo };
	}
}

export { TestsRunner };
