import { Authorized, CurrentUser, Get, JsonController, Param, QueryParams } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import UserService from '../../core/services/UserService';
import JobsService from '../../core/services/JobsService';
import TestInstanceService from '../../core/services/TestInstanceService';
import TestInstanceScreenShotsService from '../../core/services/TestInstanceScreenShotsService';
import ScreenshotComparisionsService from '../../core/services/ScreenshotComparisionsService';
import { Platform } from '../../core/interfaces/Platform';
import TestInstanceResultsService from '../../core/services/TestInstanceResultsService';
import TestInstanceResultSetsService from '../../core/services/TestInstanceResultSetsService';
import CommentsService from '../../core/services/CommentsService';
import { TestLogsService } from '../../core/services/mongo/testLogs';
import TestInstanceRecordingService from '../../core/services/TestInstanceRecordingService';

@Service()
@JsonController('/job')
export class JobsController {
	@Inject()
	private userService: UserService;
	@Inject()
	private jobsService: JobsService;
	@Inject()
	private commentsService: CommentsService;
	@Inject()
	private testInstanceService: TestInstanceService;
	@Inject()
	private testInstanceScreenShotsService: TestInstanceScreenShotsService;
	@Inject()
	private screenshotComparisionService: ScreenshotComparisionsService;
	@Inject()
	private testInstanceResultService: TestInstanceResultsService;
	@Inject()
	private testInstanceResultSetService: TestInstanceResultSetsService;
	@Inject()
	private testLogsService: TestLogsService;
	@Inject()
	private testInstanceRecordingService: TestInstanceRecordingService;

	@Authorized()
	@Get('/getProjectsJob/:projectId')
	async getAllJobs(@Param('projectId') projectId: number, @QueryParams() queries) {
		let { page } = queries;
		page = !page || page < 1 ? 1 : page;
		const totalCount = await this.jobsService.getTotalJobs(projectId);

		let jobRecords = await this.jobsService.getAllJobsOfProject(projectId, 5, (page - 1) * 5);

		for (let i = 0; i < jobRecords.length; i++) {
			jobRecords[i].screenshotCount = await this.jobsService.getTotalScreenshotsInJob(jobRecords[i].id);

			const referenceJob = await this.jobsService.getReferenceJob(jobRecords[i]);
			if (referenceJob) {
				const comparisonScreenshotsCount = await this.jobsService.getScreenshotsCountInJob(
					jobRecords[i].id,
					referenceJob.id,
				);
				jobRecords[i] = {
					...jobRecords[i],
					passedScreenshotCount:
						comparisonScreenshotsCount.totalComparisonCount === 0
							? jobRecords[i].screenshotCount
							: comparisonScreenshotsCount.passedCount,
					failedScreenshotCount: comparisonScreenshotsCount.failedCount,
					reviewRequiredScreenshotCount: comparisonScreenshotsCount.reviewRequiredCount,
				};
			} else {
				jobRecords[i] = {
					...jobRecords[i],
					passedScreenshotCount: jobRecords[i].screenshotCount,
					failedScreenshotCount: 0,
					reviewRequiredScreenshotCount: 0,
				};
			}
		}

		return {
			jobs: jobRecords,
			totalPages: Math.ceil(totalCount / 5),
		};
	}

	@Authorized()
	@Get('/getLogsOfProject/:projectId')
	async getLogsOfProject(@CurrentUser({ required: true }) user, @Param('projectId') projectId) {
		return this.jobsService.getLastNLogsOfProject(projectId);
	}

	@Authorized()
	@Get('/get/:jobId')
	async getJob(@CurrentUser({ required: true }) user, @Param('jobId') jobId, @QueryParams() query) {
		const { platform } = query;
		const job = await this.jobsService.getJob(jobId);
		const testInstances = await this.testInstanceService.getAllTestInstancesByJobIdOfPlatform(
			jobId,
			platform ? platform : Platform.CHROME,
		);

		for (let i = 0; i < testInstances.length; i++) {
			const instanceLogs = (await this.testLogsService.getLogsOfInstanceInJob(testInstances[i].id)).map((log) => {
				return log['_doc'];
			});
			const instanceRecording = await this.testInstanceRecordingService.getTestRecording(testInstances[i].id);
			testInstances[i].video_url = instanceRecording ? instanceRecording.video_uri : null;
			testInstances[i].logs = instanceLogs;
		}
		const referenceJob = await this.jobsService.getReferenceJob(job);

		const testInstancesWithResult = await this.testInstanceService.getAllInstancesWithResultByJobId(
			jobId,
			platform ? platform : Platform.CHROME,
			referenceJob ? referenceJob.id : jobId,
		);

		const resultIds = Object.keys(
			testInstancesWithResult.reduce((prev, current) => {
				return { ...prev, [current.resultSetId]: true };
			}, {}),
		);

		const comments = {};
		for (let i = 0; i < resultIds.length; i++) {
			const commentsInResultSet = await this.commentsService.getCommentsOfResultSetWithUserName(parseInt(resultIds[i]));

			comments[resultIds[i]] = commentsInResultSet.reduce((prev: any, current) => {
				return {
					...prev,
					[current.screenshot_id]: [...(prev[current.screenshot_id] ? prev[current.screenshot_id] : []), current],
				};
			}, {});
		}

		return {
			testInstances: testInstances,
			testInstancesWithResult: testInstancesWithResult,
			referenceJob: referenceJob,
			comments: comments,
			jobInfo: job,
		};
	}

	@Authorized()
	@Get('/getVisualDiffsWithFirstJob/:jobId')
	async getVisualDiffs(@CurrentUser({ required: true }) user, @Param('jobId') jobId) {
		const { user_id } = user;
		const currentJob = await this.jobsService.getJob(jobId);
		const referenceJob = await this.jobsService.getFirstJobOfHost(currentJob.host);

		const currentInstances = await this.testInstanceService.getAllInstancesWithResultByJobId(
			jobId,
			Platform.CHROME,
			currentJob.host,
		);

		const referenceInstances =
			referenceJob && (await this.testInstanceService.getAllInstancesWithResultByJobId(referenceJob.id));
		let referenceInstancesMap = {};
		if (referenceInstances) {
			for (let referenceInstance of referenceInstances) {
				referenceInstancesMap[referenceInstance.test_id] = referenceInstance;
			}
		}

		const imagesMap = {};
		for (let currentInstance of currentInstances) {
			const imagesList = [];
			const currentImages = JSON.parse(currentInstance.images);

			if (referenceInstancesMap[currentInstance.test_id]) {
				const referenceImages = JSON.parse(referenceInstancesMap[currentInstance.test_id].images);

				const referenceImageMap = {};
				for (let referenceImage of referenceImages) {
					const imageName = referenceImage.match(/\/([^?/]+?)\?/)[1];
					referenceImageMap[imageName] = referenceImage;
				}
				for (let currentImage of currentImages) {
					const imageName = currentImage.match(/\/([^?/]+?)\?/)[1];
					imagesList.push({
						currentImage: currentImage,
						referenceImage: referenceImageMap[imageName],
					});
				}
			} else {
				imagesList.push({
					currentImage: JSON.parse(currentInstance.images),
					referenceImages: [],
				});
			}
			imagesMap[currentInstance.test_id] = imagesList;
		}
		return { currentInstances, referenceInstancesMap, images: imagesMap };
	}

	@Authorized()
	@Get('/approve/tests/all/:jobId')
	async approveAllTests(@Param('jobId') jobId, @QueryParams() queries) {
		const { referenceJobId } = queries;
		if (jobId && referenceJobId) {
			return this.testInstanceResultService.markAllResultsAsApproved(jobId, referenceJobId);
		}
	}

	@Authorized()
	@Get('/approve/tests/platform/:platform/:jobId')
	async approveAllPlatformTests(@Param('jobId') jobId, @Param('platform') platform: Platform, @QueryParams() queries) {
		const { referenceJobId } = queries;
		if (jobId && referenceJobId) {
			return this.testInstanceResultService.markAllPlatformTestResultsAsApproved(jobId, referenceJobId, platform);
		}
	}
}
