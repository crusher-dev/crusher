import "reflect-metadata";
import { BuildsService } from "@modules/resources/builds/service";
import { Job } from "bullmq";
import Container from "typedi";
import { BuildTestInstanceScreenshotService } from "@modules/resources/builds/instances/screenshots.service";
import { getScreenshotActionsResult, getTemplateFileContent } from "@utils/helper";
import { BuildTestInstancesService } from "@modules/resources/builds/instances/service";
import * as RedisLock from "redlock";
import { RedisManager } from "@modules/redis";
import { BuildReportService } from "@modules/resources/buildReports/service";
import { ITestCompleteQueuePayload } from "@crusher-shared/types/queues/";
import { BuildReportStatusEnum, IBuildReportTable } from "@modules/resources/buildReports/interface";
import { BuildStatusEnum, IBuildTable } from "@modules/resources/builds/interface";
import { ProjectsService } from "@modules/resources/projects/service";
import { BuildApproveService } from "@modules/resources/buildReports/build.approve.service";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { UsersService } from "@modules/resources/users/service";
import * as ejs from "ejs";
import { resolvePathToFrontendURI } from "@utils/uri";
import { EmailManager } from "@modules/email";
import { TestsRunner } from "..";
import { iAction } from "@crusher-shared/types/action";
import { ActionStatusEnum } from "@crusher-shared/lib/runnerLog/interface";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { IntegrationsService } from "@modules/resources/integrations/service";
import { IUserTable } from "@modules/resources/users/interface";
import { IProjectTable } from "@modules/resources/projects/interface";
import { TEST_COMPLETE_QUEUE, TEST_EXECUTION_QUEUE } from "@crusher-shared/constants/queues";
import { ITestInstancesTable, TestInstanceResultSetStatusEnum } from "@modules/resources/builds/instances/interface";
import { BrowserEnum } from "../interface";
import { VercelService } from "@modules/resources/integrations/vercel/service";

const buildService = Container.get(BuildsService);
const buildReportService: BuildReportService = Container.get(BuildReportService);
const buildTestInstanceService = Container.get(BuildTestInstancesService);
const buildTestInstanceScreenshotService = Container.get(BuildTestInstanceScreenshotService);
const projectsService = Container.get(ProjectsService);
const buildApproveService = Container.get(BuildApproveService);
const usersService = Container.get(UsersService);
const projectIntegrationsService = Container.get(IntegrationsService);
const testRunnerService = Container.get(TestsRunner);
const vercelService = Container.get(VercelService);

const emailManager = Container.get(EmailManager);
const testRunner = Container.get(TestsRunner);
const redisManager: RedisManager = Container.get(RedisManager);

const redisLock = new RedisLock([redisManager.redisClient], {
	driftFactor: 0.01,
	retryCount: -1,
	retryDelay: 150,
	retryJitter: 200,
});

interface ITestResultWorkerJob extends Job {
	data: ITestCompleteQueuePayload;
}

function _replaceHostInEvents(events: Array<iAction>, newHost: string) {
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

function createExecutionTaskFlow(data: any, host: string | null = null) {
	if (host && host !== "null" && host.trim() !== "") {
		data.actions = _replaceHostInEvents(data.actions, host);
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
				children: [],
			},
		],
	};
}

async function handleParameterisedTestInstancesForExecution(
	job: ITestResultWorkerJob,
	testInstances: Array<KeysToCamelCase<ITestInstancesTable>>,
	buildInfo: any,
) {
	console.log("Test instances are", testInstances);

	const siblings = [];
	const testCompletePayload = job.data;

	for (let testInstance of testInstances) {
		const testInstanceFullInfoRecord = await buildTestInstanceService.getInstanceAllInformation(testInstance.id);
		const testActions = JSON.parse(testInstanceFullInfoRecord.testEvents);

		const finalTestActions = testActions.map((action) => {
			if (action.type === ActionsInTestEnum.RUN_AFTER_TEST) {
				action.payload.meta.storageState = testCompletePayload.storageState;
			}
			return action;
		});

		siblings.push(
			createExecutionTaskFlow(
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
			await testRunner.addTestRequestToQueue(sibling, job.opts.parent);
		}
	}
}

async function handleNextTestsForExecution(job: ITestResultWorkerJob, buildRecord: KeysToCamelCase<IBuildTable>) {
	const testCompletePayload = job.data;
	const siblings = [];

	for (const testInstance of testCompletePayload.nextTestDependencies) {
		const testInstanceFullInfoRecord = await buildTestInstanceService.getInstanceAllInformation(testInstance.testInstanceId);
		const testActions: Array<iAction> = JSON.parse(testInstanceFullInfoRecord.testEvents);

		if (testCompletePayload.hasPassed && testCompletePayload.storageState) {
			const finalTestActions = testActions.map((action) => {
				if (action.type === ActionsInTestEnum.RUN_AFTER_TEST) {
					action.payload.meta.storageState = testCompletePayload.storageState;
				}
				return action;
			});

			siblings.push(
				createExecutionTaskFlow(
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
				await processTestAfterExecution({
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
				await processTestAfterExecution({
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
			await testRunner.addTestRequestToQueue(sibling, job.opts.parent);
		}
	}
	return true;
}

function setupGracefulShutdown() {
	process.on("SIGTERM", async () => {
		console.error("Got SIGTERM in worker");
		setTimeout(() => {
			console.warn(`Couldn't pause all queues within 30s, sorry! Exiting.`);
		}, 30000);
	});
	process.on("unhandledRejection", (reason, p) => {
		p.catch((error) => {
			console.error("unhandledRejection" + `Caught exception: ${reason}\n` + `Exception origin: ${p}`);
			console.error(error);
		});
	});

	process.on("uncaughtException", (err: Error) => {
		console.error("uncaughtException" + `Caught exception: ${err.message}\n` + `Exception origin: ${err.stack}`);
		console.error(err);
	});
}

setupGracefulShutdown();
const processTestAfterExecution = async function (bullJob: ITestResultWorkerJob): Promise<any> {
	const buildRecord = await buildService.getBuild(bullJob.data.buildId);
	const buildReportRecord = await buildReportService.getBuildReportRecord(buildRecord.latestReportId);

	if (bullJob.data.type === "process") {
		if (bullJob.data.parameterizedTests && bullJob.data.parameterizedTests.length) {
			const siblingTestInstances = await testRunnerService.spawnTestInstances(
				bullJob.data.parameterizedTests,
				bullJob.data.buildExecutionPayload.config.browser || BrowserEnum.CHROME,
				buildReportRecord.id,
			);
			await handleParameterisedTestInstancesForExecution(bullJob, siblingTestInstances.testInstances, siblingTestInstances.buildInfo);
		}
		await handleNextTestsForExecution(bullJob, buildRecord);
		const actionsResultWithIndex = bullJob.data.actionResults.map((actionResult, index) => ({ ...actionResult, actionIndex: index }));

		const screenshotActionsResultWithIndex = getScreenshotActionsResult(actionsResultWithIndex);

		const savedScreenshotRecords = await buildTestInstanceScreenshotService.saveScreenshots(screenshotActionsResultWithIndex, bullJob.data.testInstanceId);

		// Compare visual diffs and save the final result
		await buildTestInstanceService.saveResult(
			actionsResultWithIndex,
			savedScreenshotRecords,
			bullJob.data.testInstanceId,
			buildRecord.projectId,
			bullJob.name,
			bullJob.data.hasPassed,
			bullJob.data.isStalled,
		);

		// Wait for the final test in the list here
		await redisManager.incr(`${bullJob.data.buildId}:completed`);
		return "PROCESSED";
	} else {
		const testInstancesResultsInReport = await buildTestInstanceService.getResultSets(buildRecord.latestReportId);
		const haveAllTestInstanceCompletedChecks = testInstancesResultsInReport.every(
			(result) => result.status === TestInstanceResultSetStatusEnum.FINISHED_RUNNING_CHECKS,
		);
		if (haveAllTestInstanceCompletedChecks) {
			// This is the last test result to finish
			const buildReportStatus = await buildReportService.calculateResultAndSave(buildRecord.latestReportId, buildReportRecord.totalTestCount);

			await buildService.updateStatus(BuildStatusEnum.FINISHED, buildRecord.id);

			const buildRecordMeta = buildRecord.meta ? JSON.parse(buildRecord.meta) : null;

			if (buildRecordMeta?.isProjectLevelBuild && buildReportStatus === BuildReportStatusEnum.PASSED) {
				// Automatically update the baseline to the latest build
				await projectsService.updateBaselineBuild(buildRecord.id, buildRecord.projectId);
			}
			// @TODO: Add integrations here (Notify slack, etc.)
			console.log("Build status: ", buildReportStatus);

			await handleIntegrations(buildRecord, buildReportRecord, buildReportStatus);
			// await Promise.all(await sendReportStatusEmails(buildRecord, buildReportStatus));
			return "SHOULD_CALL_POST_EXECUTION_INTEGRATIONS_NOW";
		}
	}
};

async function getSlackMessageBlockForBuildReport(
	buildRecord: KeysToCamelCase<IBuildTable>,
	projectRecord: KeysToCamelCase<IProjectTable>,
	buildReportRecord: KeysToCamelCase<IBuildReportTable>,
	userInfo: KeysToCamelCase<IUserTable>,
	reportStatus: BuildReportStatusEnum,
): Promise<Array<any>> {
	const infoFields = [
		{
			type: "mrkdwn",
			text: `*Build Id:*\n${buildRecord.id}`,
		},
		{
			type: "mrkdwn",
			text: `*Tests Count:*\n${buildReportRecord.totalTestCount}`,
		},
		{
			type: "mrkdwn",
			text: `*Triggerred By:*\n${userInfo.name}`,
		},
		{
			type: "mrkdwn",
			text: `*Status:*\n${reportStatus}`,
		},
	];

	if (buildRecord.host && buildRecord.host !== "null") {
		infoFields.push({
			type: "mrkdwn",
			text: `*Host*:\n${buildRecord.host}`,
		});
	}

	return [
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: `A build was triggered for project ${projectRecord.name}:\n*<${resolvePathToFrontendURI(`/app/build/${buildRecord.id}`)}|#${
					buildRecord.latestReportId
				}>*`,
			},
		},
		{
			type: "section",
			fields: infoFields,
		},
		{
			type: "actions",
			elements: [
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "View Reports",
						emoji: true,
					},
					value: "click_me_123",
					url: resolvePathToFrontendURI(`/app/build/${buildRecord.id}`),
					action_id: "button-action",
				},
			],
		},
	];
}

const getVercelConclusionFromBuildReportStatus = (buildReportStatus: BuildReportStatusEnum) => {
	switch (buildReportStatus) {
		case BuildReportStatusEnum.PASSED:
			return "succeeded";
		case BuildReportStatusEnum.FAILED:
			return "failed";
		case BuildReportStatusEnum.MANUAL_REVIEW_REQUIRED:
			return "neutral";
		default:
			return "neutral";
	}
}
async function handleIntegrations(
	buildRecord: KeysToCamelCase<IBuildTable>,
	buildReportRecord: KeysToCamelCase<IBuildReportTable>,
	reportStatus: BuildReportStatusEnum,
) {
	const userInfo = await usersService.getUserInfo(buildRecord.userId);
	const projectRecord = await projectsService.getProject(buildRecord.projectId);

	// Github Integration
	await buildService.markGithubCheckFlowFinished(reportStatus, buildRecord.id);
	// Slack Integration
	await projectIntegrationsService.postSlackMessageIfNeeded(
		buildRecord.projectId,
		await getSlackMessageBlockForBuildReport(buildRecord, projectRecord, buildReportRecord, userInfo, reportStatus),
		reportStatus === BuildReportStatusEnum.PASSED ? "normal" : "alert",
	);
	
	const buildRecordMeta: { vercel: { checkId: string; deploymentId: string; teamId: string;}, github: { repoName: string; commitId: string;}} = buildRecord.meta ? JSON.parse(buildRecord.meta) : null;
	console.log("Build record meta: ", buildRecordMeta);
	if(buildRecordMeta && buildRecordMeta.vercel && buildRecordMeta.github) {
		const repoName = buildRecordMeta.github.repoName;
		const vercelIntegrationRecord = await vercelService.getIntegrationRecordFromRepoName(repoName);
		if(!vercelIntegrationRecord) {
			console.error("Could not find vercel integration record for repo: ", repoName);
			return;
		}

		const vercelIntegrationMeta : {accessToken: string; userId: number;} = vercelIntegrationRecord.meta;
		const detailsUrl = `${resolvePathToFrontendURI(`/app/build/${buildRecord.id}`)}`;
		console.log("Vercel integration meta: ", vercelIntegrationMeta);
		await vercelService.finishDeploymentChecks(
			vercelIntegrationMeta.accessToken,
			buildRecordMeta.vercel.deploymentId,
			buildRecordMeta.vercel.checkId,
			buildRecordMeta.vercel.teamId,
			getVercelConclusionFromBuildReportStatus(reportStatus),
			detailsUrl
		);
	};
}

async function sendReportStatusEmails(buildRecord: KeysToCamelCase<IBuildTable>, buildReportStatus: BuildReportStatusEnum): Promise<Array<Promise<boolean>>> {
	if (buildReportStatus === BuildReportStatusEnum.PASSED) return;

	const usersInProject = await usersService.getUsersInProject(buildRecord.projectId);
	const emailTemplateFilePathMap = {
		[BuildReportStatusEnum.PASSED]:
			typeof __non_webpack_require__ !== "undefined" ? "/email/templates/passedJob.ejs" : "/../../email/templates/passedJob.ejs",
		[BuildReportStatusEnum.MANUAL_REVIEW_REQUIRED]:
			typeof __non_webpack_require__ !== "undefined"
				? "/email/templates/manualReviewRequiredJob.ejs"
				: "/../../email/templates/manualReviewRequiredJob.ejs",
		[BuildReportStatusEnum.FAILED]:
			typeof __non_webpack_require__ !== "undefined" ? "/email/templates/failedJob.ejs" : "/../../email/templates/failedJob.ejs",
	};

	console.log("Reading email template from: ", __dirname + emailTemplateFilePathMap[buildReportStatus]);

	const emailTemplate = await getTemplateFileContent(__dirname + emailTemplateFilePathMap[buildReportStatus], {
		buildId: buildRecord.id,
		branchName: buildRecord.branchName,
		buildReviewUrl: resolvePathToFrontendURI(`/app/build/${buildRecord.id}`),
	});

	return usersInProject.map((user) => {
		return emailManager.sendEmail(user.email, `Build ${buildRecord.id} ${buildReportStatus}`, emailTemplate);
	});
}

export default processTestAfterExecution;
