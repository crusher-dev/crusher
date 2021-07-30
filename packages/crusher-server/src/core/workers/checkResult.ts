import JobsService from "../services/JobsService";
import TestService from "../services/TestService";
import TestInstanceService from "../services/TestInstanceService";
import TestInstanceResultSetsService from "../services/TestInstanceResultSetsService";
import TestInstanceResultsService from "../services/TestInstanceResultsService";
import TestInstanceScreenShotsService from "../services/TestInstanceScreenShotsService";
import AlertingService from "../services/AlertingService";
import UserService from "../services/UserService";
import { InstanceStatus } from "../interfaces/InstanceStatus";
import { JobStatus } from "../interfaces/JobStatus";
import { TestInstance } from "../interfaces/db/TestInstance";
import { TestInstanceResultSetStatus } from "../interfaces/TestInstanceResultSetStatus";
import { TestInstanceScreenshot } from "../interfaces/db/TestInstanceScreenshot";
import { visualDiffWithURI } from "../utils/visualDiff";
import { TestType } from "../interfaces/TestType";
import { TestInstanceResultStatus } from "../interfaces/TestInstanceResultStatus";
import { updateGithubCheckStatus } from "../../utils/github";
import { GithubCheckStatus } from "../interfaces/GithubCheckStatus";
import { GithubConclusion } from "../interfaces/GithubConclusion";
import AlertingManager from "../manager/AlertingManager";
import { Container } from "typedi";
import { iUser } from "@crusher-shared/types/db/iUser";
import { EmailManager } from "../manager/EmailManager";
import { resolvePathToFrontendURI } from "../utils/uri";
import { Job } from "bullmq";
import { REDIS } from "../../../config/database";
import "reflect-metadata";

import * as IORedis from "ioredis";
import JobReportServiceV2 from "../services/v2/JobReportServiceV2";
import { TestInstanceResultSetConclusion } from "../interfaces/TestInstanceResultSetConclusion";
import { JobReportStatus } from "../interfaces/JobReportStatus";
import * as ejs from "ejs";
import * as ReddisLock from "redlock";
import { LocalFileStorage } from "@crusher-shared/lib/storage";
import { AwsCloudStorage } from "@crusher-shared/lib/storage/aws";

const jobsService = Container.get(JobsService);
const jobsReportService = Container.get(JobReportServiceV2);

const testService = Container.get(TestService);
const testInstanceService = Container.get(TestInstanceService);
const testInstanceResultSetsService = Container.get(TestInstanceResultSetsService);
const testInstanceResultsService = Container.get(TestInstanceResultsService);
const testInstanceScreenshotsService = Container.get(TestInstanceScreenShotsService);
const alertingService = Container.get(AlertingService);
const userService = Container.get(UserService);
const setupBucketManager = () => {
	if (process.env.STORAGE_MODE === "local") {
		const storagePort = parseInt(process.env.STORAGE_PORT, 10);

		return new LocalFileStorage({
			port: storagePort,
			bucketName: "crusher-videos",
			baseFolder: process.env.BASE_STORAGE_FOLDER,
		});
	}

	return new AwsCloudStorage({
		bucketName: "crusher-videos",
		bucketRegion: "us-east-1",
	});
};

const cloudBucketManager = setupBucketManager();

interface TestInstanceWithImages extends TestInstance {
	images: {
		[imageKey: string]: TestInstanceScreenshot;
	};
}
async function getOrganisedTestInstanceWithImages(testInstance: TestInstance): Promise<TestInstanceWithImages> {
	const images = await testInstanceScreenshotsService.getAllScreenShotsOfInstance(testInstance.id);

	const imagesMap = images.reduce((prevImages, image) => {
		return {
			...prevImages,
			[image.name + "_" + testInstance.platform]: image,
		};
	}, {});

	return {
		...testInstance,
		images: imagesMap,
	};
}
function getReferenceInstance(referenceJobId, testId, platform) {
	return testInstanceService.getReferenceTestInstance(referenceJobId, testId, platform);
}

async function calculateDiffBetweenImages(testInstanceImage, referenceInstanceImage, diffPath) {
	let uploadedDiffUrl = "none";
	console.log("Generating visual diff", testInstanceImage.url, referenceInstanceImage.url);
	const diff = await visualDiffWithURI(testInstanceImage.url, referenceInstanceImage.url);

	const diffDelta = diff.diffDelta;

	uploadedDiffUrl = await cloudBucketManager.uploadBuffer(diff.outputBuffer as any, diffPath);

	return { diffDelta, uploadedDiffUrl };
}

function getInstanceResultStatus(hasPassed, hasFailed) {
	if (!hasPassed && !hasFailed) {
		return TestInstanceResultStatus.MANUAL_REVIEW_REQUIRED;
	} else if (hasPassed) {
		return TestInstanceResultStatus.PASSED;
	} else {
		return TestInstanceResultStatus.FAILED;
	}
}

async function getResultForTestInstance(
	testInstanceWithImages: TestInstanceWithImages,
	referenceInstanceWithImages: TestInstanceWithImages,
	resultSetId: number,
	shouldPerformDiffChecks,
) {
	const testInstanceImageKeys: Array<string> = Object.keys(testInstanceWithImages.images);

	let didAllImagesPass = true;
	let passedImagesCount = 0;
	let manualReviewImagesCount = 0;
	let failedImagesCount = 0;

	const outPromisesFun = testInstanceImageKeys.map((testInstanceKey) => {
		return async () => {
			const testInstanceImage = testInstanceWithImages.images[testInstanceKey];
			const referenceInstanceImage = referenceInstanceWithImages.images[testInstanceKey];
			console.log("Should run diff", testInstanceImage, referenceInstanceImage);

			if (shouldPerformDiffChecks && referenceInstanceImage) {
				try {
					const timeNow = Date.now();
					const diffResult = await calculateDiffBetweenImages(
						testInstanceImage,
						referenceInstanceImage,
						`${TestType.SAVED}/${testInstanceImage.instance_id}/diff_${testInstanceKey}_${timeNow}.png`,
					);
					const { diffDelta, uploadedDiffUrl } = diffResult;
					const hasImagePassed = diffDelta <= 0.05 ? true : false;
					// THe middle area is for marked for review.
					const hasImageFailed = diffDelta > 5 ? true : false;

					const imageComparisonResult = getInstanceResultStatus(hasImagePassed, hasImageFailed);

					if (imageComparisonResult === TestInstanceResultStatus.MANUAL_REVIEW_REQUIRED) {
						didAllImagesPass = false;
						manualReviewImagesCount++;
					} else if (imageComparisonResult === TestInstanceResultStatus.PASSED) {
						passedImagesCount++;
					} else {
						didAllImagesPass = false;
						failedImagesCount++;
					}

					return await testInstanceResultsService.createResult({
						screenshot_id: testInstanceImage.id,
						target_screenshot_id: referenceInstanceImage.id,
						diff_delta: diffDelta,
						diff_image_url: uploadedDiffUrl,
						status: imageComparisonResult,
						instance_result_set_id: resultSetId,
					});
				} catch (ex) {
					didAllImagesPass = false;
					failedImagesCount++;
					return await testInstanceResultsService.createResult({
						screenshot_id: testInstanceImage.id,
						target_screenshot_id: referenceInstanceImage.id,
						diff_delta: 0,
						diff_image_url: null,
						status: TestInstanceResultStatus.ERROR_CREATING_DIFF,
						instance_result_set_id: resultSetId,
					});
				}
			} else {
				passedImagesCount++;

				return await testInstanceResultsService.createResult({
					screenshot_id: testInstanceImage.id,
					target_screenshot_id: testInstanceImage.id,
					diff_delta: 0,
					diff_image_url: null,
					status: TestInstanceResultStatus.PASSED,
					instance_result_set_id: resultSetId,
				});
			}
		};
	});

	try {
		await Promise.all(
			outPromisesFun.map((fun: any) => {
				return fun();
			}),
		);
	} catch (ex) {
		console.error("Something happened");
		console.error(ex);
	}

	return {
		didAllImagesPass,
		passedImagesCount,
		manualReviewImagesCount,
		failedImagesCount,
	};
}

function notifyResultWithEmail(jobRecord: any, result: JobReportStatus, userWhoStartedTheJob: iUser) {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve, reject) => {
		const emailTemplateFilePathMap = {
			[JobReportStatus.FAILED]: "/../../templates/failedJob.ejs",
			[JobReportStatus.MANUAL_REVIEW_REQUIRED]: "/../../templates/manualReviewRequiredJob.ejs",
		};

		const templatePath = emailTemplateFilePathMap[result];
		if (!templatePath) {
			return;
		}

		const usersInTeam = await testService.findMembersOfProject(jobRecord.project_id);
		return ejs.renderFile(
			__dirname + templatePath,
			{
				jobId: jobRecord.id,
				branchName: jobRecord.branch_name,
				jobReviewUrl: resolvePathToFrontendURI(`/app/job/review?jobId=${jobRecord.id}`),
			},
			function (err, str) {
				if (err) return reject("Can't load the invite member template");
				EmailManager.sendEmailToUsers(usersInTeam, `Job ${jobRecord.id} ${result}`, str);
				resolve(true);
			},
		);
	});
}

async function notifyResultWithSlackIntegrations(jobRecord: any, result: JobReportStatus, userWhoStartedTheJob: iUser, state) {
	const slackIntegrationsArr = await alertingService.getSlackIntegrationsInProject(jobRecord.project_id);

	for (let i = 0; i < slackIntegrationsArr.length; i++) {
		await AlertingManager.sendSlackMessage(
			slackIntegrationsArr[i].webhook_url,
			jobRecord,
			userWhoStartedTheJob,
			{
				passed: state.passedTestsArray.length,
				failed: state.failedTestsArray.length,
				review: state.markedForReviewTestsArray.length,
			},
			state.failedTestsArray,
			result,
		);
	}
}

async function notifyResultToGithubChecks(jobRecord: any, result: JobReportStatus, userWhoStartedTheJob: iUser) {
	await updateGithubCheckStatus(
		GithubCheckStatus.COMPLETED,
		{
			fullRepoName: jobRecord.repo_name,
			githubCheckRunId: jobRecord.check_run_id,
			githubInstallationId: jobRecord.installation_id,
		},
		result === JobReportStatus.PASSED ? GithubConclusion.SUCCESS : GithubConclusion.FAILURE,
	);
}

async function handlePostChecksOperations(reportId: number, totalTestCount, jobId: number) {
	const jobRecord = await jobsService.getJob(jobId);
	const userWhoStartedThisJob = await userService.getUserInfo(jobRecord.user_id);
	let jobConclusion = JobReportStatus.FAILED;

	const allResultSets = await testInstanceResultSetsService.getResultSets(reportId);
	const state = {
		passedTestsArray: [],
		failedTestsArray: [],
		markedForReviewTestsArray: [],
	};
	allResultSets.map((resultSet) => {
		const { conclusion } = resultSet;
		if (conclusion === TestInstanceResultSetConclusion.PASSED) {
			state.passedTestsArray.push(resultSet);
		} else if (conclusion === TestInstanceResultSetConclusion.FAILED) {
			state.failedTestsArray.push(resultSet);
		} else {
			state.markedForReviewTestsArray.push(resultSet);
		}
	});

	let explanation = "";
	if (state.passedTestsArray.length === totalTestCount) {
		jobConclusion = JobReportStatus.PASSED;
		explanation = "All tests passed with visual checks";
	} else if (state.failedTestsArray.length) {
		jobConclusion = JobReportStatus.FAILED;
		explanation = "There are some failed tests in this build";
	} else if (!state.failedTestsArray.length && state.markedForReviewTestsArray.length) {
		jobConclusion = JobReportStatus.MANUAL_REVIEW_REQUIRED;
		explanation = "No tests failed, but some of them requires manual review";
	}

	await jobsReportService.updateJobReportStatus(jobConclusion, reportId, explanation);
	await jobsReportService.updateTestStatusCount(reportId, {
		passed_test_count: state.passedTestsArray.length,
		failed_test_count: state.failedTestsArray.length,
		review_required_test_count: state.markedForReviewTestsArray.length,
	});

	await notifyResultToGithubChecks(jobRecord, jobConclusion, userWhoStartedThisJob);
	await notifyResultWithEmail(jobRecord, jobConclusion, userWhoStartedThisJob);
	await notifyResultWithSlackIntegrations(jobRecord, jobConclusion, userWhoStartedThisJob, state);
}

async function runChecks(details, clearJobTempValues) {
	const { githubInstallationId, githubCheckRunId, error, platform, reportId, totalTestCount, screenshots, testId, jobId, instanceId, fullRepoName } = details;

	const currentJobReport = await jobsReportService.getJobReport(reportId);

	const testInstance = await testInstanceService.getTestInstance(instanceId);
	const referenceInstance = await getReferenceInstance(currentJobReport.reference_job_id, testId, platform);
	const shouldPerformDiffChecks = jobId !== currentJobReport.reference_job_id;

	// Create result set for this config
	const { insertId: resultSetId } = await testInstanceResultSetsService.createResultSet({
		instance_id: instanceId,
		target_instance_id: referenceInstance ? referenceInstance.id : instanceId,
		report_id: reportId,
		status: TestInstanceResultSetStatus.RUNNING_CHECKS,
	});

	const testInstanceWithImages = await getOrganisedTestInstanceWithImages(testInstance);
	const referenceInstanceWithImages = await getOrganisedTestInstanceWithImages(referenceInstance);
	console.log("Reference instance is", testInstanceWithImages, referenceInstanceWithImages);

	const { didAllImagesPass, passedImagesCount, manualReviewImagesCount, failedImagesCount } = await getResultForTestInstance(
		testInstanceWithImages,
		referenceInstanceWithImages,
		resultSetId,
		shouldPerformDiffChecks,
	);

	await testInstanceResultSetsService.updateResultSetStatus(resultSetId, reportId, error);
}

module.exports = async (bullJob: Job) => {
	const redisConnectionObject = REDIS.connectionString ? REDIS.connectionString : { port: REDIS.port, host: REDIS.host, password: REDIS.password };
	const reddisClient = new IORedis(redisConnectionObject as any);

	const reddisLock = new ReddisLock([reddisClient], {
		driftFactor: 0.01,
		retryCount: -1,
		retryDelay: 150,
		retryJitter: 200,
	});

	const {
		error,
		githubInstallationId,
		githubCheckRunId,
		testCount: totalTestCount,
		images: screenshots,
		testId,
		jobId,
		instanceId,
		reportId,
		fullRepoName,
		platform,
	} = bullJob.data;

	async function clearJobTempValues(jobId) {
		await reddisClient.multi().del(`${jobId}:started`).del(`${jobId}:completed`).exec();
	}

	try {
		await testInstanceService.updateTestInstanceStatus(InstanceStatus.FINISHED, instanceId);

		reddisLock.lock(`${jobId}:completed:lock1`, 15000).then(async function (lock) {
			await reddisClient.incr(`${jobId}:completed`);
			const completedTestsCount = parseInt(await reddisClient.get(`${jobId}:completed`));

			await runChecks(
				{
					error,
					githubInstallationId,
					githubCheckRunId,
					totalTestCount,
					screenshots,
					testId,
					jobId,
					instanceId,
					reportId,
					fullRepoName,
					platform,
				},
				clearJobTempValues,
			);

			console.log("Cleaning up now", completedTestsCount, totalTestCount);
			if (completedTestsCount === totalTestCount) {
				const job = await jobsService.getJob(jobId);
				if (job.status !== JobStatus.ABORTED) {
					await jobsService.updateJobStatus(JobStatus.FINISHED, jobId);
				}
				await clearJobTempValues(jobId);
				await handlePostChecksOperations(reportId, totalTestCount, jobId);
			}

			try {
				return lock.unlock();
			} catch (ex) {
				console.error(ex);
				return true;
			}
		});
	} catch (Ex) {
		console.error(Ex);
	}
};
