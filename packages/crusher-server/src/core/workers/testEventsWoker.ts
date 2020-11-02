import { TestType } from '../interfaces/TestType';
import TestInstanceService from '../services/TestInstanceService';
import JobsService from '../services/JobsService';
import DraftInstanceService from '../services/DraftInstanceService';
import { InstanceStatus } from '../interfaces/InstanceStatus';
import { updateGithubCheckStatus } from '../../utils/github';
import { GithubCheckStatus } from '../interfaces/GithubCheckStatus';
import { GithubConclusion } from '../interfaces/GithubConclusion';
import { JobStatus } from '../interfaces/JobStatus';
import { JobConclusion } from '../interfaces/JobConclusion';
import DraftInstanceResultsService from '../services/DraftInstanceResultsService';
import TestInstanceScreenShotsService from '../services/TestInstanceScreenShotsService';
import TestInstanceRecordingService from '../services/TestInstanceRecordingService';
import { Logger } from '../../utils/logger';

const ReddisLock = require('redlock');

async function prepareResultForTestInstance(instanceId, logs, images, jobId, video, testId) {
	const testInstanceScreenshotService = new TestInstanceScreenShotsService();
	const testInstanceRecordingService = new TestInstanceRecordingService();

	const screenshotsPromise = images.map((image) => {
		const { url, name } = image;
		return testInstanceScreenshotService.addScreenshot({
			instance_id: instanceId,
			name: name,
			url: url,
		});
	});

	if (video) {
		await testInstanceRecordingService.createTestInstanceRecording({
			test_instance_id: instanceId,
			video_uri: video,
			test_id: testId,
		});
	}

	await Promise.all(screenshotsPromise);

	Logger.info('QueueManager::prepareResultForTestInstance', `\x1b[36m Test ${instanceId}\x1b[0m result created!!`);
}

async function prepareResultForDraftInstance(instanceId, logs, images, video) {
	const draftInstanceService = new DraftInstanceService();
	const draftInstanceResultsService = new DraftInstanceResultsService();

	if (instanceId) {
		const draftInstanceService = new DraftInstanceService();
		await draftInstanceService.updateDraftInstanceStatus(InstanceStatus.FINISHED, instanceId);
		await draftInstanceResultsService.createDraftResult({
			instance_id: instanceId,
			logs: JSON.stringify(logs),
			images: JSON.stringify(images),
			video_uri: video,
		});
	}
}

export default class TestsEventsWorker {
	private static Logger: any;

	constructor(Logger) {}

	static async onTestCompleted(reddisClient, checkResultQueue, callback) {
		const {
			isError,
			logs,
			images,
			video,
			testId,
			jobId,
			instanceId,
			githubInstallationId,
			githubCheckRunId,
			testCount,
			fullRepoName,
			testType,
		} = callback.returnvalue;
		try {
			if (!isError) {
				Logger.info('QueueManager::testCompleted', `\x1b[36m Test #${testId}\x1b[0m completed!!`);

				if (testType === TestType.DRAFT) {
					await prepareResultForDraftInstance(instanceId, logs, images, video);
				} else {
					await prepareResultForTestInstance(instanceId, logs, images, jobId, video, testId);

					await checkResultQueue.add(testId, {
						githubInstallationId,
						githubCheckRunId,
						testCount,
						logs,
						images,
						testId,
						jobId,
						instanceId,
						fullRepoName,
					});
				}
				Logger.info('QueueManager::testCompleted', 'Added to checkResult queue');
			} else {
				const testInstanceService = new TestInstanceService();
				const jobsService = new JobsService();
				if (testType === TestType.DRAFT) {
					const draftInstanceService = new DraftInstanceService();
					await draftInstanceService.updateDraftInstanceStatus(InstanceStatus.ABORTED, instanceId);

					await prepareResultForDraftInstance(instanceId, logs, images, video);
				} else {
					if (githubInstallationId) {
						await updateGithubCheckStatus(
							GithubCheckStatus.COMPLETED,
							{
								fullRepoName,
								githubCheckRunId,
								githubInstallationId,
							},
							GithubConclusion.FAILURE,
						);
					}
					if (jobId) {
						await jobsService.updateJobStatus(JobStatus.ABORTED, jobId);

						try {
							await prepareResultForTestInstance(instanceId, logs, images, jobId, video, testId);

							await checkResultQueue.add(testId, {
								githubInstallationId,
								githubCheckRunId,
								testCount,
								logs,
								images,
								testId,
								jobId,
								instanceId,
								fullRepoName,
							});
						} catch (ex) {}

						await jobsService.updateJobInfo(jobId, {
							conclusion: JobConclusion.FAILED,
						});

						await testInstanceService.updateTestInstanceStatus(InstanceStatus.ABORTED, instanceId);
					}
				}
			}
		} catch (Ex) {
			Logger.error('QueueManager::testCompleted', 'Error Occured', {
				err: Ex,
			});

			console.error(Ex);
		}
		return true;
	}

	static async onTestProgress(reddisClient, bullJob) {
		const {
			repoName: fullRepoName,
			githubCheckRunId,
			githubInstallationId,
			status,
			testInstanceId,
			jobId,
			testType,
		} = bullJob.data;

		const reddisLock = new ReddisLock([reddisClient], {
			driftFactor: 0.01,
			retryCount: -1,
			retryDelay: 150,
			retryJitter: 200,
		});

		Logger.info('QueueManager::jobProgress', `\x1b[36m Test ${testInstanceId}\x1b[0m in progress!!`);
		const testInstanceService = new TestInstanceService();
		const jobsService = new JobsService();

		if (testType === TestType.DRAFT) {
			const draftInstanceService = new DraftInstanceService();
			await draftInstanceService.updateDraftInstanceStatus(InstanceStatus.RUNNING, testInstanceId);
		} else {
			let firstTest = false;
			await reddisLock.lock(`${jobId}:started:lock1`, 2000).then(async function (lock) {
				const startedTests = await reddisClient.get(`${jobId}:started`);
				if (parseInt(startedTests) === 0) {
					firstTest = true;
				}
				await reddisClient.incr(`${jobId}:started`);
				try {
					return lock.unlock();
				} catch (ex) {
					console.error(ex);
				}
			});

			if (status === GithubCheckStatus.IN_PROGRESS && firstTest) {
				if (githubInstallationId && githubCheckRunId) {
					await updateGithubCheckStatus(status, {
						fullRepoName,
						githubCheckRunId,
						githubInstallationId,
					});
				}

				await jobsService.updateJobStatus(JobStatus.RUNNING, jobId);
			}
			await testInstanceService.updateTestInstanceStatus(InstanceStatus.RUNNING, testInstanceId);
		}
	}
}
