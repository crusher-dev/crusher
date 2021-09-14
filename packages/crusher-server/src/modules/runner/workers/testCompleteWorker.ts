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
import { BuildReportStatusEnum } from "@modules/resources/buildReports/interface";
import { BuildStatusEnum, IBuildTable } from "@modules/resources/builds/interface";
import { ProjectsService } from "@modules/resources/projects/service";
import { BuildApproveService } from "@modules/resources/buildReports/build.approve.service";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { UsersService } from "@modules/resources/users/service";
import * as ejs from "ejs";
import { resolvePathToFrontendURI } from "@utils/uri";
import { EmailManager } from "@modules/email";

const buildService = Container.get(BuildsService);
const buildReportService: BuildReportService = Container.get(BuildReportService);
const buildTestInstanceService = Container.get(BuildTestInstancesService);
const buildTestInstanceScreenshotService = Container.get(BuildTestInstanceScreenshotService);
const projectsService = Container.get(ProjectsService);
const buildApproveService = Container.get(BuildApproveService);
const usersService = Container.get(UsersService);
const emailManager = Container.get(EmailManager);

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

export default async function (bullJob: ITestResultWorkerJob): Promise<any> {
	const buildRecord = await buildService.getBuild(bullJob.data.buildId);

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
	);

	// Wait for the final test in the list here
	const completedTestCount = await redisLock.lock(`${bullJob.data.buildId}:completed:lock`, 5000).then(async function (lock) {
		return redisManager.incr(`${bullJob.data.buildId}:completed`);
	});

	if (completedTestCount === bullJob.data.buildTestCount) {
		// This is the last test result to finish
		const buildReportStatus = await buildReportService.calculateResultAndSave(buildRecord.latestReportId, bullJob.data.buildTestCount);

		await buildService.updateStatus(BuildStatusEnum.FINISHED, buildRecord.id);

		const buildRecordMeta = buildRecord.meta ? JSON.parse(buildRecord.meta) : null;

		if (buildRecordMeta?.isProjectLevelBuild && buildReportStatus === BuildReportStatusEnum.PASSED) {
			// Automatically update the baseline to the latest build
			await projectsService.updateBaselineBuild(buildRecord.id, buildRecord.projectId);
		}
		// @TODO: Add integrations here (Notify slack, etc.)
		console.log("Build status: ", buildReportStatus);

		await handleIntegrations(buildRecord.id, buildReportStatus);
		await Promise.all(await sendReportStatusEmails(buildRecord, buildReportStatus));
		return "SHOULD_CALL_POST_EXECUTION_INTEGRATIONS_NOW";
	}
}

async function handleIntegrations(buildId: number, reportStatus: BuildReportStatusEnum) {
	// Github Integration
	await buildService.markGithubCheckFlowFinished(reportStatus, buildId);
}

async function sendReportStatusEmails(buildRecord: KeysToCamelCase<IBuildTable>, buildReportStatus: BuildReportStatusEnum): Promise<Array<Promise<boolean>>> {
	const usersInProject = await usersService.getUsersInProject(buildRecord.projectId);
	const emailTemplateFilePathMap = {
		[BuildReportStatusEnum.PASSED]: "/../../email/templates/passedJob.ejs",
		[BuildReportStatusEnum.MANUAL_REVIEW_REQUIRED]: "/../../email/templates/manualReviewRequiredJob.ejs",
		[BuildReportStatusEnum.FAILED]: "/../../email/templates/failedJob.ejs",
	};

	const emailTemplate = await getTemplateFileContent(__dirname + emailTemplateFilePathMap[buildReportStatus], {
		buildId: buildRecord.id,
		branchName: buildRecord.branchName,
		buildReviewUrl: resolvePathToFrontendURI(`/app/build/${buildRecord.id}`),
	});

	return usersInProject.map((user) => {
		return emailManager.sendEmail(user.email, `Build ${buildRecord.id} ${buildReportStatus}`, emailTemplate);
	});
}
