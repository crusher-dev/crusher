import TestInstanceService from "../services/TestInstanceService";
import JobsService from "../services/JobsService";
import DraftInstanceService from "../services/DraftInstanceService";
import { InstanceStatus } from "../interfaces/InstanceStatus";
import { updateGithubCheckStatus } from "../../utils/github";
import { GithubCheckStatus } from "../interfaces/GithubCheckStatus";
import { GithubConclusion } from "../interfaces/GithubConclusion";
import { JobStatus } from "../interfaces/JobStatus";
import DraftInstanceResultsService from "../services/DraftInstanceResultsService";
import TestInstanceScreenShotsService from "../services/TestInstanceScreenShotsService";
import { Logger } from "../../utils/logger";
import "reflect-metadata";
import JobReportServiceV2 from "../services/v2/JobReportServiceV2";
import { JobReportStatus } from "../interfaces/JobReportStatus";
import { Job } from "bullmq";
import { iJobRunRequest } from "../../../../crusher-shared/types/runner/jobRunRequest";
import { Redis } from "ioredis";
import { RUNNER_REQUEST_TYPE } from "../../../../crusher-shared/types/runner/requestType";
import { iTestRunnerJobOutput } from "../../../../crusher-shared/types/runner/jobRunRequestOutput";
import * as path from "path";

const ReddisLock = require("redlock");

async function prepareResultForTestInstance(instanceId, images, jobId, testId) {
	const testInstanceScreenshotService = new TestInstanceScreenShotsService();

	const screenshotsPromise = images.map((imageUrl) => {
		const imageName = path.basename(imageUrl).split("?")[0];

		return testInstanceScreenshotService.addScreenshot({
			instance_id: instanceId,
			name: imageName,
			url: imageUrl,
		});
	});

	await Promise.all(screenshotsPromise);

	Logger.info("QueueManager::prepareResultForTestInstance", `\x1b[36m Test ${instanceId}\x1b[0m result created!!`);
}

async function prepareResultForDraftInstance(instanceId, images, isError = false) {
	const draftInstanceResultsService = new DraftInstanceResultsService();

	if (instanceId) {
		const draftInstanceService = new DraftInstanceService();
		await draftInstanceService.updateDraftInstanceStatus(isError ? InstanceStatus.ABORTED : InstanceStatus.FINISHED, instanceId);
		await draftInstanceResultsService.createDraftResult({
			instance_id: instanceId,
			logs: "",
			images: JSON.stringify(images),
			video_uri: "",
		});
	}
}

interface iTestRunnerProgressJob extends Job {
	data: iJobRunRequest;
}

export default class TestsEventsWorker {
	private static Logger: any;

	constructor(Logger) {}

	static async onTestCompleted(checkResultQueue, data: iTestRunnerJobOutput) {
		const { runnerJobRequestInfo, error, output } = data;

		try {
			if (!error) {
				Logger.info("QueueManager::testCompleted", `\x1b[36m Test #${runnerJobRequestInfo.test.id}\x1b[0m completed!!`);

				if (runnerJobRequestInfo.requestType === RUNNER_REQUEST_TYPE.DRAFT) {
					await prepareResultForDraftInstance(runnerJobRequestInfo.instanceId, output.signedImageUrls);
				} else {
					await prepareResultForTestInstance(
						runnerJobRequestInfo.instanceId,
						output.signedImageUrls,
						runnerJobRequestInfo.job.id,
						runnerJobRequestInfo.test.id,
					);

					await checkResultQueue.add(runnerJobRequestInfo.test.id, {
						error: error,
						githubInstallationId: runnerJobRequestInfo.job.installation_id,
						githubCheckRunId: runnerJobRequestInfo.job.check_run_id,
						testCount: runnerJobRequestInfo.testCount,
						images: output.signedImageUrls,
						testId: runnerJobRequestInfo.test.id,
						jobId: runnerJobRequestInfo.job.id,
						instanceId: runnerJobRequestInfo.instanceId,
						fullRepoName: runnerJobRequestInfo.job.repo_name,
						reportId: runnerJobRequestInfo.job.report_id,
						platform: runnerJobRequestInfo.platform,
					});
				}
				Logger.info("QueueManager::testCompleted", "Added to checkResult queue");
			} else {
				const testInstanceService = new TestInstanceService();
				const jobsService = new JobsService();
				const jobReportsService = new JobReportServiceV2();

				if (runnerJobRequestInfo.requestType === RUNNER_REQUEST_TYPE.DRAFT) {
					const draftInstanceService = new DraftInstanceService();
					await draftInstanceService.updateDraftInstanceStatus(InstanceStatus.ABORTED, runnerJobRequestInfo.instanceId);

					await prepareResultForDraftInstance(runnerJobRequestInfo.instanceId, output.signedImageUrls, !!error);
				} else {
					const job = runnerJobRequestInfo.job;

					if (job) {
						await jobsService.updateJobStatus(JobStatus.ABORTED, runnerJobRequestInfo.job.id);

						try {
							await prepareResultForTestInstance(
								runnerJobRequestInfo.instanceId,
								output.signedImageUrls,
								runnerJobRequestInfo.job.id,
								runnerJobRequestInfo.test.id,
							);

							await checkResultQueue.add(runnerJobRequestInfo.test.id, {
								error: error,
								githubInstallationId: runnerJobRequestInfo.job.installation_id,
								githubCheckRunId: runnerJobRequestInfo.job.check_run_id,
								testCount: runnerJobRequestInfo.testCount,
								images: output.signedImageUrls,
								testId: runnerJobRequestInfo.test.id,
								jobId: runnerJobRequestInfo.job.id,
								instanceId: runnerJobRequestInfo.instanceId,
								fullRepoName: runnerJobRequestInfo.job.repo_name,
								reportId: runnerJobRequestInfo.job.report_id,
								platform: runnerJobRequestInfo.platform,
							});
						} catch (ex) {
							await jobReportsService.updateJobReportStatus(
								JobReportStatus.FAILED,
								runnerJobRequestInfo.job.report_id,
								`#${runnerJobRequestInfo.instanceId} failed to execute successfully.`,
							);

							await testInstanceService.updateTestInstanceStatus(InstanceStatus.ABORTED, runnerJobRequestInfo.instanceId);
						}

						if (job.installation_id) {
							await updateGithubCheckStatus(
								GithubCheckStatus.COMPLETED,
								{
									fullRepoName: runnerJobRequestInfo.job.repo_name,
									githubCheckRunId: runnerJobRequestInfo.job.check_run_id,
									githubInstallationId: runnerJobRequestInfo.job.repo_name,
								},
								GithubConclusion.FAILURE,
							);
						}
					}


				}
			}
		} catch (Ex) {
			Logger.error("QueueManager::testCompleted", "Error Occured", {
				err: Ex,
			});

			console.error(Ex);
		}
		return true;
	}

	static async onTestProgress(redisClient: Redis, bullJob: iTestRunnerProgressJob) {
		const jobRequest = bullJob.data;

		const redisLock = new ReddisLock([redisClient], {
			driftFactor: 0.01,
			retryCount: -1,
			retryDelay: 150,
			retryJitter: 200,
		});

		Logger.info("QueueManager::jobProgress", `\x1b[36m Test ${jobRequest.instanceId}\x1b[0m in progress!!`);
		const testInstanceService = new TestInstanceService();
		const jobsService = new JobsService();

		if (jobRequest.requestType === RUNNER_REQUEST_TYPE.DRAFT) {
			const draftInstanceService = new DraftInstanceService();
			await draftInstanceService.updateDraftInstanceStatus(InstanceStatus.RUNNING, jobRequest.instanceId);
		} else {
			let firstTest = false;
			await redisLock.lock(`${jobRequest.job.id}:started:lock1`, 2000).then(async function (lock) {
				const startedTests = await redisClient.get(`${jobRequest.job.id}:started`);
				if (parseInt(startedTests) === 0) {
					firstTest = true;
				}
				await redisClient.incr(`${jobRequest.job.id}:started`);
				try {
					return lock.unlock();
				} catch (ex) {
					console.error(ex);
				}
			});
			console.log("GITHUB INSTALLATION ID", jobRequest.job.installation_id, jobRequest.job.check_run_id);

			if (firstTest) {
				console.log("GITHUB INSTALLATION ID", jobRequest.job.installation_id, jobRequest.job.check_run_id);
				if (jobRequest.job.installation_id && jobRequest.job.check_run_id) {
					await updateGithubCheckStatus(status, {
						fullRepoName: jobRequest.job.repo_name,
						githubCheckRunId: jobRequest.job.check_run_id,
						githubInstallationId: jobRequest.job.installation_id,
					});
				}

				await jobsService.updateJobStatus(JobStatus.RUNNING, jobRequest.job.id);
			}
			await testInstanceService.updateTestInstanceStatus(InstanceStatus.RUNNING, jobRequest.instanceId);
		}
	}
}
