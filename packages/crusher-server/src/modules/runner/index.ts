import Container, { Inject, Service } from "typedi";
import { BuildsService } from "@modules/resources/builds/service";
import { ICreateBuildRequestPayload } from "@modules/resources/builds/interface";
import { BrowserEnum, IBuildTaskPayload, ITestDependencyArray, ITestInstanceDependencyArray } from "./interface";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { ITestTable } from "@modules/resources/tests/interface";
import { PLATFORM } from "@crusher-shared/types/platform";
import { QueueManager } from "@modules/queue";
import { TEST_COMPLETE_QUEUE, TEST_EXECUTION_QUEUE } from "@crusher-shared/constants/queues";
import { INextTestInstancesDependencies, ITestCompleteQueuePayload, ITestExecutionQueuePayload } from "@crusher-shared/types/queues";
import { BuildReportService } from "@modules/resources/buildReports/service";
import { BuildTestInstancesService } from "@modules/resources/builds/instances/service";
import { ICreateTestInstancePayload, ITestInstancesTable } from "@modules/resources/builds/instances/interface";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { BadRequestError } from "routing-controllers";
import { iAction } from "@crusher-shared/types/action";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { DBManager } from "@modules/db";
import { GithubService } from "@modules/thirdParty/github/service";
@Service()
class TestsRunner {
	@Inject()
	private buildsService: BuildsService;
	@Inject()
	private dbManager: DBManager;
	@Inject()
	private buildTestInstanceService: BuildTestInstancesService;
	@Inject()
	private buildReportService: BuildReportService;
	@Inject()
	private queueManager: QueueManager;
	@Inject()
	private githubService: GithubService;

	// @Caution: Make sure to prevent race condition here
	async addTestRequestToQueue(payload: any, parent: any) {
		const flowTree = await this.queueManager.getFlowProducer().add({
			...payload,
			opts: {
				parent: parent,
			},
		});

		await this.queueManager.redisManager.redisClient.hset(parent.queue + ":" + flowTree.job.id, "parentKey", parent.queue + ":" + parent.id);
		await this.queueManager.redisManager.redisClient.hset(
			parent.queue + ":" + flowTree.job.id,
			"parent",
			JSON.stringify({ id: parent.id, queueKey: parent.queue }),
		);

		const opts = await this.queueManager.redisManager.redisClient.hget(parent.queue + ":" + flowTree.job.id, "opts");
		let optsObject: any = (opts && opts.length ? JSON.parse(opts) : null) || ({} as any);
		optsObject.parent = { id: parent.id, queue: parent.queue };

		await this.queueManager.redisManager.redisClient.hset(parent.queue + ":" + flowTree.job.id, "opts", JSON.stringify(optsObject));
		await this.queueManager.redisManager.redisClient.sadd(parent.queue + ":" + parent.id + ":dependencies", parent.queue + ":" + flowTree.job.id);
	}

	private _getNextTestInstancesDependencyArr(
		testInstance: ITestInstanceDependencyArray[0],
		testInstances: ITestInstanceDependencyArray,
	): Array<INextTestInstancesDependencies> {
		const nextTestInstances = testInstances.filter((test) => test.parentTestInstanceId === testInstance.id);
		if (!nextTestInstances.length) return [];

		return nextTestInstances.map((testInstance) => ({
			testInstanceId: testInstance.id,
			nextTestDependencies: this._getNextTestInstancesDependencyArr(testInstance, testInstances),
		}));
	}

	_replaceHostInEvents(events: Array<iAction>, newHost: string) {
		if (!newHost || newHost === "null") return events;

		return events.map((event) => {
			if (event.type === ActionsInTestEnum.NAVIGATE_URL) {
				const urlToGo = new URL(event.payload.meta.value);
				const newHostURL = new URL(newHost);
				urlToGo.host = newHostURL.host;
				urlToGo.port = newHostURL.port;
				urlToGo.protocol = newHostURL.protocol;
				event.payload.meta.value = urlToGo.toString();
			}
			return event;
		});
	}

	private createExecutionTaskFlow(data: any, host: string | null = null) {
		if (host && host !== "null") {
			data.actions = this._replaceHostInEvents(data.actions, host);
		}

		return {
			name: `${data.buildId}/${data.testInstanceId}`,
			queueName: TEST_COMPLETE_QUEUE,
			data: {
				type: "process",
			},
			children: [
				{
					name: `${data.buildId}/${data.testInstanceId}`,
					queueName: TEST_EXECUTION_QUEUE,
					data,
				},
			],
		};
	}

	private async startBuildTask(
		buildTaskInfo: IBuildTaskPayload & {
			testInstances: Array<ITestInstanceDependencyArray[0] & { context?: any }>;
		},
	) {
		const { testInstances } = buildTaskInfo;
		const flowChildrens = [];
		const addTestInstancePromiseArr = testInstances.map((testInstance) => {
			if (!testInstance.parentTestInstanceId) {
				flowChildrens.push(
					this.createExecutionTaskFlow(
						{
							actions: JSON.parse(testInstance.testInfo.events),
							nextTestDependencies: this._getNextTestInstancesDependencyArr(testInstance, testInstances),
							config: {
								browser: testInstance.browser as any,
								shouldRecordVideo: buildTaskInfo.config.shouldRecordVideo,
								proxyUrlsMap: buildTaskInfo.config.proxyUrlsMap,
							},
							buildId: buildTaskInfo.buildId,
							testInstanceId: testInstance.id,
							testName: testInstance.testInfo.name,
							buildTestCount: testInstances.length,
							startingStorageState: null,
							startingPersistentContext: null,
							// Crusher-context tree
							context: testInstance.context ? testInstance.context : buildTaskInfo.context,
						},
						buildTaskInfo.host,
					),
				);
			}
		});

		await this.queueManager.getFlowProducer().add({
			name: `${buildTaskInfo.buildId}/complete`,
			queueName: TEST_COMPLETE_QUEUE,
			data: {
				type: "complete-build",
				buildId: buildTaskInfo.buildId,
				buildTestCount: testInstances.length,
			},
			children: flowChildrens,
		});

		await Promise.all(addTestInstancePromiseArr);
	}

	private _getTestDependency(test: KeysToCamelCase<ITestTable>) {
		const events = JSON.parse(test.events);
		return events.find((action) => action.type === ActionsInTestEnum.RUN_AFTER_TEST);
	}

	private _getDependenciesTestArr(tests: Array<KeysToCamelCase<ITestTable>>): ITestDependencyArray {
		const testsMapById: { [id: number]: ITestDependencyArray[0] } = tests.reduce((prev, test) => {
			return { ...prev, [test.id]: { ...test, isFirstLevelTest: true, postTestList: [], parentTestId: null } };
		}, {});

		for (const entry of Object.entries(testsMapById)) {
			const [_, test] = entry as any;
			const dependency = this._getTestDependency(test);

			if (dependency) {
				const parentTest = testsMapById[dependency.payload.meta.value];
				if (parentTest) {
					parentTest.postTestList.push(test);
					test.isFirstLevelTest = false;
					test.parentTestId = parentTest.id;
				} else {
					throw new BadRequestError("Parent test not in the tests list");
				}
			}
		}

		const finalTestList = Object.values(testsMapById).filter((test) => test.isFirstLevelTest);
		return finalTestList;
	}

	private async createTestInstances(testsList: ITestDependencyArray, buildPayload: ICreateTestInstancePayload, buildId: number) {
		const browserArr: Array<BrowserEnum> = buildPayload.browser;
		const testInstancesArr: ITestInstanceDependencyArray = [];
		// Create test instances and store their ids
		const createTestInstanceWithBrowser = async (
			test: ITestDependencyArray[0],
			browserArr: Array<BrowserEnum>,
			parentTestInstance: typeof testInstancesArr[0] | null = null,
		) => {
			const insertRecordPromiseArr = browserArr.map(async (browser) => {
				const buildInstanceInsertRecord = await this.buildTestInstanceService.createBuildTestInstance(
					{
						jobId: buildId,
						testId: test.id,
						// @TODO: Need a proper host here
						host: buildPayload.host,
						browser: browser,
						groupId: test.groupId,
						meta: {
							groupId: test.groupId,
							isSpawned: buildPayload.isSpawned ? buildPayload.isSpawned : false,
							parentTestInstanceId: parentTestInstance ? parentTestInstance.id : null,
							isFirstLevel: test.isFirstLevelTest,
							context: test.context ? test.context : null,
						},
					},
					test.context,
				);

				return this.buildTestInstanceService.getInstance(buildInstanceInsertRecord.insertId);
			});

			const testInstances = await Promise.all(insertRecordPromiseArr);
			return testInstances.map((testInstance) => ({
				...testInstance,
				testInfo: test,
				context: test.context,
				parentTestInstanceId: parentTestInstance ? parentTestInstance.id : null,
			}));
		};

		const createTestInstancesRecrusivelyAccordingToPostTestList = async (
			test: ITestDependencyArray[0],
			parentTestInstance: typeof testInstancesArr[0] | null = null,
		) => {
			// For the first-level test, create tests instances with the browsers according to build config
			// Later on the dependent test instances will be created recursively according to their parent test instances
			const testInstances = await createTestInstanceWithBrowser(test, parentTestInstance ? [parentTestInstance.browser] : browserArr, parentTestInstance);
			testInstancesArr.push(...testInstances);

			if (test.postTestList.length) {
				await Promise.all(
					testInstances.map((testInstance) =>
						Promise.all(test.postTestList.map((postTest) => createTestInstancesRecrusivelyAccordingToPostTestList(postTest, testInstance))),
					),
				);
			}
		};

		await Promise.all(testsList.map((test) => createTestInstancesRecrusivelyAccordingToPostTestList(test)));
		return testInstancesArr;
	}

	private async _getTestMapFromArr(testIdArr: Array<number>): Promise<{ [id: number]: KeysToCamelCase<ITestTable> }> {
		const filtered = testIdArr.reduce((prev, testId) => {
			return { ...prev, [testId]: testId };
		}, {});

		const testsArr = await Promise.all(
			Object.values(filtered).map((testId: number) => {
				// @TODO: This is just a workaround for reflect-metadata cyclic dependecny. Clean it
				return this.getTest(testId);
			}),
		);

		return testsArr.reduce((prev, test) => {
			return { ...prev, [test.id]: test };
		}, {});
	}

	@CamelizeResponse()
	async getTest(testId: number): Promise<KeysToCamelCase<ITestTable>> {
		return this.dbManager.fetchSingleRow("SELECT * FROM public.tests WHERE id = ?", [testId]);
	}

	async spawnTestInstances(tests: Array<{ testId: number; groupId: string; context: any }>, browser: BrowserEnum, buildReportId: number) {
		try {
			console.log("Tests are", tests);
			const build = await this.buildsService.getBuildFromReportId(buildReportId);
			console.log("Buid is", build);
			const buildMeta = JSON.parse(build.meta);
			console.log("Build meta is", buildMeta);

			const buildReport = await this.buildReportService.getBuildReportRecord(buildReportId);
			const testsMap = await this._getTestMapFromArr(tests.map((test) => test.testId));

			console.log("Tests map is", testsMap);

			const testsArr = tests.map((test) => {
				return {
					...testsMap[test.testId],
					isFirstLevelTest: true,
					postTestList: [],
					parentTestId: null,
					groupId: test.groupId,
					context: test.context,
				};
			});

			let testInstances = [];
			testInstances = await this.createTestInstances(
				testsArr,
				{
					host: buildMeta && buildMeta.host ? buildMeta.host : undefined,
					browser: [browser],
					isSpawned: true,
				},
				build.id,
			);

			// Update build report count
			await this.buildReportService.incrementBuildReportTotalCount(tests.length, buildReport.id);
			const testsResultsSetsInsertPromiseArr = testInstances.map(async (testInstance) => {
				const referenceInstance = await this.buildTestInstanceService.getReferenceInstance(testInstance.id);
				return this.buildTestInstanceService.createBuildTestInstanceResultSet({
					reportId: buildReport.id,
					instanceId: testInstance.id,
					targetInstanceId:
						testInstance && testInstance.disableBaseLineComparisions ? testInstance.id : referenceInstance ? referenceInstance.id : testInstance.id,
				});
			});

			await Promise.all(testsResultsSetsInsertPromiseArr);
			const buildInfo: any = {
				buildId: build.id,
				tests: [],
				host: "",
				isVideoOn: true,
				isInitialTest: false,
				projectId: build.projectId,
				testInstances: testInstances,
				buildTrigger: build.buildTrigger,
				userId: build.userId,
				browser: [browser],
				config: {
					shouldRecordVideo: true,
				},
			};

			return { testInstances: testInstances, buildInfo: buildInfo };
		} catch (err) {
			console.error("Error is", err);
			throw err;
		}
	}

	async runTests(tests: Array<KeysToCamelCase<ITestTable>>, buildPayload: ICreateBuildRequestPayload, baselineBuildId: number = null) {
		const build = await this.buildsService.createBuild(buildPayload);
		const testsListWIthDependency = this._getDependenciesTestArr(tests);
		let githubMeta = null;
		if (buildPayload.meta && buildPayload.meta.github) {
			githubMeta = await this.buildsService.initGithubCheckFlow(buildPayload.meta.github, build.insertId);
		}

		const testInstancesArr: ITestInstanceDependencyArray = await this.createTestInstances(testsListWIthDependency, buildPayload, build.insertId);

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
				targetInstanceId: buildPayload.meta.disableBaseLineComparisions ? testInstance.id : referenceInstance.id,
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

		if (githubMeta && githubMeta.installationId) {
			const githubService = new GithubService();
			await githubService.authenticateAsApp(githubMeta.installationId);

			await githubService.createOrUpdateIssueComment(
				{ fullRepoName: githubMeta.repoName, commit: githubMeta.commitId },
				build.insertId,
				buildPayload.projectId,
			);
		}

		return { buildId: build.insertId, buildInfo: buildInfo };
	}
}

export { TestsRunner };
