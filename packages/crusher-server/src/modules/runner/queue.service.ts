import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { ActionStatusEnum } from "@crusher-shared/lib/runnerLog/interface";
import { iAction } from "@crusher-shared/types/action";
import { ITestCompleteQueuePayload } from "@crusher-shared/types/queues";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { RedisManager } from "@modules/redis";
import { BuildReportStatusEnum, IBuildReportTable } from "@modules/resources/buildReports/interface";
import { BuildReportService } from "@modules/resources/buildReports/service";
import { ITestInstancesTable, TestInstanceResultSetStatusEnum } from "@modules/resources/builds/instances/interface";
import { BuildTestInstanceScreenshotService } from "@modules/resources/builds/instances/screenshots.service";
import { BuildTestInstancesService } from "@modules/resources/builds/instances/service";
import { BuildStatusEnum, IBuildTable, ICreateBuildRequestPayload } from "@modules/resources/builds/interface";
import { BuildsService } from "@modules/resources/builds/service";
import { ProjectsService } from "@modules/resources/projects/service";
import { getScreenshotActionsResult } from "@utils/helper";
import { Job } from "bullmq";
import { Inject, Service } from "typedi";
import { TestsRunner } from ".";
import { RunnerIntegrationsService } from "./integrations.service";
import { BrowserEnum } from "./interface";
import { RunnerUtils } from "./utils";

interface ITestResultWorkerJob extends Job {
	data: ITestCompleteQueuePayload;
}

@Service()
class TestRunnerQueue {
    @Inject()
    private buildService: BuildsService;
    @Inject()
    private projectsService: ProjectsService;
    @Inject()
    private buildReportService: BuildReportService;
    @Inject()
    private buildTestInstanceService: BuildTestInstancesService;
    @Inject()
    private testRunner: TestsRunner;
    @Inject()
    private buildTestInstanceScreenshotService: BuildTestInstanceScreenshotService;
    @Inject()
    private redisManager: RedisManager;
    @Inject()
    private runnerIntegrationsService: RunnerIntegrationsService;

    async handleParameterisedTestInstancesForExecution(
        job: ITestResultWorkerJob,
        testInstances: Array<KeysToCamelCase<ITestInstancesTable>>,
        buildInfo: any,
    ) {
        const siblings = [];
        const testCompletePayload = job.data;
    
        for (let testInstance of testInstances) {
            const testInstanceFullInfoRecord = await this.buildTestInstanceService.getInstanceAllInformation(testInstance.id);
            const testActions = JSON.parse(testInstanceFullInfoRecord.testEvents);
    
            const finalTestActions = testActions.map((action) => {
                if (action.type === ActionsInTestEnum.RUN_AFTER_TEST) {
                    action.payload.meta.storageState = testCompletePayload.storageState;
                }
                return action;
            });
    
            siblings.push(
                RunnerUtils.createExecutionTaskFlow(
                    {
                        ...testCompletePayload.buildExecutionPayload,
                        exports: testCompletePayload.exports,
                        startingStorageState: testCompletePayload.storageState,
                        actions: finalTestActions,
                        config: {
                            ...testCompletePayload.buildExecutionPayload.config,
                            browser: testInstanceFullInfoRecord.browser,
                        },
                        testInstanceId: testInstance.id,
                        testName: testInstanceFullInfoRecord.testName,
                        nextTestDependencies: [],
                        startingPersistentContext: testCompletePayload.persistenContextZipURL,
    
                        // Crusher-context tree
                        context: testInstance.context ? testInstance.context : job.data.context ? job.data.context : {},
                    },
                    buildInfo.host && buildInfo.host !== "null" ? buildInfo.host : null,
                ),
            );
        }
    
        if (siblings.length) {
            for (const sibling of siblings) {
                await this.testRunner.addTestRequestToQueue(sibling, job.opts.parent);
            }
        }
    }

    async handleNextTestsForExecution(job: ITestResultWorkerJob, buildRecord: KeysToCamelCase<IBuildTable>) {
        const testCompletePayload = job.data;
        const siblings = [];
    
        for (const testInstance of testCompletePayload.nextTestDependencies) {
            const testInstanceFullInfoRecord = await this.buildTestInstanceService.getInstanceAllInformation(testInstance.testInstanceId);
            const testActions: Array<iAction> = JSON.parse(testInstanceFullInfoRecord.testEvents);
    
            if (testCompletePayload.hasPassed && testCompletePayload.storageState) {
                const finalTestActions = testActions.map((action) => {
                    if (action.type === ActionsInTestEnum.RUN_AFTER_TEST) {
                        action.payload.meta.storageState = testCompletePayload.storageState;
                    }
                    return action;
                });
    
                siblings.push(
                    RunnerUtils.createExecutionTaskFlow(
                        {
                            ...testCompletePayload.buildExecutionPayload,
                            exports: testCompletePayload.exports,
                            startingStorageState: testCompletePayload.storageState,
                            actions: finalTestActions,
                            config: {
                                ...testCompletePayload.buildExecutionPayload.config,
                                browser: testInstanceFullInfoRecord.browser,
                            },
                            testInstanceId: testInstance.testInstanceId,
                            testName: testInstanceFullInfoRecord.testName,
                            nextTestDependencies: testInstance.nextTestDependencies,
                            startingPersistentContext: testCompletePayload.persistenContextZipURL,
                        },
                        buildRecord.host && buildRecord.host !== "null" ? buildRecord.host : null,
                    ),
                );
            } else {
                if (job.data.isStalled) {
                    await this.handleWorkerJob({
                        type: `process`,
                        name: `${testCompletePayload.buildId}/${testCompletePayload.testInstanceId}`,
                        data: {
                            ...testCompletePayload,
                            exports: [],
                            nextTestDependencies: testInstance.nextTestDependencies,
                            actionResults: testActions.map((action) => ({
                                actionType: action.type,
                                status: ActionStatusEnum.STALLED,
                                message: "Parent test stalled",
                            })),
                            testInstanceId: testInstance.testInstanceId,
                            hasPassed: true,
                            isStalled: true,
                            failedReason: new Error("Parent test stalled"),
                        },
                    } as any);
                } else {
                    await this.handleWorkerJob({
                        type: `process`,
                        name: `${testCompletePayload.buildId}/${testCompletePayload.testInstanceId}`,
                        data: {
                            ...testCompletePayload,
                            exports: [],
                            nextTestDependencies: testInstance.nextTestDependencies,
                            actionResults: testActions.map((action) => ({
                                actionType: action.type,
                                status: ActionStatusEnum.FAILED,
                                message: "Parent test failed",
                            })),
                            testInstanceId: testInstance.testInstanceId,
                            hasPassed: false,
                            failedReason: new Error("Parent test failed"),
                        },
                    } as any);
                }
            }
        }
    
        if (siblings.length) {
            for (const sibling of siblings) {
                await this.testRunner.addTestRequestToQueue(sibling, job.opts.parent);
            }
        }
        return true;
    }


    async handleProcessJob(bullJob: ITestResultWorkerJob, buildRecord: KeysToCamelCase<IBuildTable>, buildReportRecord: KeysToCamelCase<IBuildReportTable>, shouldCompareScreenshot = true) {
        if (bullJob.data.parameterizedTests && bullJob.data.parameterizedTests.length) {
			const siblingTestInstances = await this.testRunner.spawnTestInstances(
				bullJob.data.parameterizedTests,
				bullJob.data.buildExecutionPayload.config.browser || BrowserEnum.CHROME,
				buildReportRecord.id,
			);
			await this.handleParameterisedTestInstancesForExecution(bullJob, siblingTestInstances.testInstances, siblingTestInstances.buildInfo);
		}
		await this.handleNextTestsForExecution(bullJob, buildRecord);

		let actionsResultWithIndex = bullJob.data.actionResults.map((actionResult, index) => ({ ...actionResult, actionIndex: index }));
        let screenshotActionsResultWithIndex = [];
        let  savedScreenshotRecords = [];
        
        if(shouldCompareScreenshot) {
            screenshotActionsResultWithIndex = getScreenshotActionsResult(actionsResultWithIndex);
            savedScreenshotRecords = await this.buildTestInstanceScreenshotService.saveScreenshots(screenshotActionsResultWithIndex, bullJob.data.testInstanceId);
        }


        console.log("Bull job data", bullJob.data);
		// Compare visual diffs and save the final result
		await this.buildTestInstanceService.saveResult(
			actionsResultWithIndex,
			savedScreenshotRecords,
			bullJob.data.testInstanceId,
			buildRecord.projectId,
			bullJob.name,
			bullJob.data.hasPassed,
			bullJob.data.isStalled,
            bullJob.data.harUrl
		);

		// Wait for the final test in the list here
		await this.redisManager.incr(`${bullJob.data.buildId}:completed`);
		return "PROCESSED";
    }

    async handleCompleteBuild(buildRecord: KeysToCamelCase<IBuildTable>, buildReportRecord: KeysToCamelCase<IBuildReportTable>) {
        const testInstancesResultsInReport = await this.buildTestInstanceService.getResultSets(buildRecord.latestReportId);
		const haveAllTestInstanceCompletedChecks = testInstancesResultsInReport.every(
			(result) => result.status === TestInstanceResultSetStatusEnum.FINISHED_RUNNING_CHECKS,
		);
		if (haveAllTestInstanceCompletedChecks) {
			// This is the last test result to finish
			const buildReportStatus = await this.buildReportService.calculateResultAndSave(buildRecord.latestReportId, buildReportRecord.totalTestCount);

			await this.buildService.updateStatus(BuildStatusEnum.FINISHED, buildRecord.id);

			const buildRecordMeta = buildRecord.meta ? JSON.parse(buildRecord.meta) : null;

			if (buildRecordMeta?.isProjectLevelBuild && buildReportStatus === BuildReportStatusEnum.PASSED) {
				// Automatically update the baseline to the latest build
				await this.projectsService.updateBaselineBuild(buildRecord.id, buildRecord.projectId);
			}
			// @TODO: Add integrations here (Notify slack, etc.)
			await this.runnerIntegrationsService.handleIntegrations(buildRecord, buildReportRecord, buildReportStatus);
			// await Promise.all(await this.runnerIntegrationsService.sendReportStatusEmails(buildRecord, buildReportStatus));
			return { buildReportStatus };
		}

        return {};
    }

    async handleWorkerJob(bullJob: ITestResultWorkerJob) {
        const buildRecord = await this.buildService.getBuild(bullJob.data.buildId);
        const buildReportRecord = await this.buildReportService.getBuildReportRecord(buildRecord.latestReportId);
    
        if (bullJob.data.type === "process") {
            return this.handleProcessJob(bullJob, buildRecord, buildReportRecord);
        } else {
            // bullJob.data.tyle === "complete-build"
            return this.handleCompleteBuild(buildRecord, buildReportRecord);
        }
    }

    async saveLocalBuilds(
        tests: Array<{ steps: Array<any>; id: number; name: string; status: "FINISHED" | "FAILED" }>,
        buildPayload: ICreateBuildRequestPayload
    ) {
        const { tests: testRecords, instanceResults, buildReportId, buildId } = await this.testRunner.setupLocalBuild(tests, buildPayload);
        const buildReport = await this.buildReportService.getBuildReportRecord(buildReportId);
        const build = await this.buildService.getBuild(buildId);
        
        const testInstanceWithActionResults = instanceResults;
        const processPromiseArr = testInstanceWithActionResults.map(async (instanceWithResult) => {
            return this.handleProcessJob({
                data: {
                    type: "process",
                    exports: [],
                    context: null,
                    nextTestDependencies: [],
                    parameterizedTests: [],
                    buildExecutionPayload: {} as any, // build-execution payload
                    actionResults: instanceWithResult["results"] as any,
                    buildId: buildId,
                    testInstanceId: instanceWithResult.id,
                    buildTestCount: testInstanceWithActionResults.length,
                    storageState: null,
                    hasPassed: instanceWithResult.status === "FINISHED",
                    failedReason: instanceWithResult.status !== "FINISHED" ? new Error("Error during local run") : undefined,
                    // failedReason?: Error & { isStalled: boolean };
                    isStalled: undefined,
                    persistenContextZipURL: null
                }
            } as any, build, buildReport, false);
        });
        await Promise.all(processPromiseArr);

        const { buildReportStatus} = await this.handleCompleteBuild(build, buildReport);

        return { build, buildReport, buildReportStatus };
    }
}

export { TestRunnerQueue }
