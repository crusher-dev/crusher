import { Inject, Service } from 'typedi';
import {
	Authorized,
	CurrentUser,
	Get,
	Put,
	Post,
	Patch,
	JsonController,
	Param,
	Res,
	Body,
	QueryParams
} from 'routing-controllers';
import JobReportServiceV2 from "../../../core/services/v2/JobReportServiceV2";
import CommentsServiceV2 from "../../../core/services/v2/CommentsServiceV2";
import TestInstanceV2Service from "../../../core/services/v2/TestInstanceV2Service";
import TestInstanceResultsV2 from "../../../core/services/v2/TestInstanceResultsV2";
import TestInstanceResultsService from "../../../core/services/TestInstanceResultsService";
import JobsService from "../../../core/services/JobsService";
import {JobTrigger} from "../../../core/interfaces/JobTrigger";

@Service()
@JsonController('/v2/job/report')
export class JobReportsController {

	@Inject()
	private jobReportsService: JobReportServiceV2;

	@Inject()
	private commentsServiceV2: CommentsServiceV2;

	@Inject()
	private testInstanceV2Service: TestInstanceV2Service;

	@Inject()
	private testInstanceResultsServiceV2: TestInstanceResultsV2;

	@Inject()
	private jobsService: JobsService;

	@Post("/")
	async createJobReport(@Body() body){

	}

	@Get("/list/:projectId")
	async getJobReportsInProject(@Param("projectId") projectId: number, @QueryParams() queries){
		let { page, category, itemsPerPage } = queries;
		page = page && !isNaN(page) && page >= 1 ? page : 1;
		let trigger = null;
		if(parseInt(category) === 1) {
			trigger = JobTrigger.MONITORING;
		} else if (parseInt(category) === 2){
			trigger = JobTrigger.MANUAL;
		}
		const totalCountRecord = await this.jobReportsService.getTotalJobsReportsCountInProject(projectId, trigger);

		const reports = await this.jobReportsService.getAllJobReportsInProjectPage(projectId, trigger, itemsPerPage ? itemsPerPage : 5, (page - 1) * (itemsPerPage ? itemsPerPage : 5));

		for (let i = 0; i < reports.length; i++) {
			reports[i].screenshotCount = await this.jobsService.getTotalScreenshotsInJob(reports[i].jobId);
			const referenceJobId = reports[i].referenceJobId ? reports[i].referenceJobId: reports[i].jobId;
			if (reports[i].referenceJobId) {
				const comparisonScreenshotsCount = await this.jobsService.getScreenshotsCountInJobReport(reports[i].reportId, reports[i].jobId);
				reports[i] = {
					...reports[i],
					passedScreenshotCount: comparisonScreenshotsCount.totalComparisonCount === 0 ? reports[i].screenshotCount : comparisonScreenshotsCount.passedCount,
					failedScreenshotCount: comparisonScreenshotsCount.failedCount,
					reviewRequiredScreenshotCount: comparisonScreenshotsCount.reviewRequiredCount,
				};
			} else {
				reports[i] = {
					...reports[i],
					passedScreenshotCount: reports[i].screenshotCount,
					failedScreenshotCount: 0,
					reviewRequiredScreenshotCount: 0,
				};
			}
		}

		return {
			jobs: reports,
			category: category,
			trigger: trigger,
			totalPages: Math.ceil(totalCountRecord.totalCount / 5),
		};
	}

	@Get("/:reportId")
	async getJobReport(@Param("reportId") reportId: number){
		const report = await this.jobReportsService.getJobReport(reportId);

		return report;
	}

	@Get("/full/:reportId")
	async getFullJobReportWithResult(@Param("reportId") reportId: number){
		const report = await this.jobReportsService.getJobReport(reportId);
		const commentsMap = await this.commentsServiceV2.getCommentsInReportId(reportId);
		const jobRecord = await this.jobsService.getJob(report.job_id);
		const referenceJobRecord = await this.jobsService.getJob(report.reference_job_id);
		const testInstancesWithMediaMap = await this.testInstanceV2Service.getTestInstancesMapWithMedia(report.job_id);
		const testInstanceResultsMap = await this.testInstanceResultsServiceV2.getResultsForReport(reportId);

		return {
			job: jobRecord,
			referenceJob: referenceJobRecord,
			instances: testInstancesWithMediaMap,
			results: testInstanceResultsMap,
			comments: commentsMap,
		};
	}
}
