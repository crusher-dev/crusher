import { Inject, Service } from 'typedi';
import { Authorized, CurrentUser, Get, JsonController, Param, Res } from 'routing-controllers';
import TestInstanceService from '../../../core/services/TestInstanceService';
import JobsService from '../../../core/services/JobsService';
import TestInstanceV2Service from '../../../core/services/v2/TestInstanceV2Service';
import CommentsServiceV2 from '../../../core/services/v2/CommentsServiceV2';
import TestInstanceResultsV2 from '../../../core/services/v2/TestInstanceResultsV2';

@Service()
@JsonController('/v2/job')
export class JobsControllerV2 {
	@Inject()
	private testInstanceService: TestInstanceService;
	@Inject()
	private jobsService: JobsService;
	@Inject()
	private testInstanceV2Service: TestInstanceV2Service;
	@Inject()
	private commentsServiceV2: CommentsServiceV2;
	@Inject()
	private testInstanceResultsServiceV2: TestInstanceResultsV2;

	@Get('/get/:jobId')
	async getJob(@Param('jobId') jobId: number) {
		const jobRecord = await this.jobsService.getJob(jobId);
		const defaultReferenceJob = await this.jobsService.getReferenceJob(jobRecord);
		const referenceJob = defaultReferenceJob ? defaultReferenceJob : jobRecord;

		const commentsMap = await this.commentsServiceV2.getCommentsBetweenJobs(jobRecord.id, referenceJob.id);
		const testInstancesWithMediaMap = await this.testInstanceV2Service.getTestInstancesMapWithMedia(jobRecord.id);
		const testInstanceResultsMap = await this.testInstanceResultsServiceV2.getResultsForJob(
			jobRecord.id,
			referenceJob.id,
		);

		return {
			job: jobRecord,
			referenceJob: referenceJob,
			instances: testInstancesWithMediaMap,
			results: testInstanceResultsMap,
			comments: commentsMap,
		};
	}

	@Authorized()
	@Get('/status/:jobId')
	async checkJobStatus(@CurrentUser({ required: true }) user, @Param(':jobId') jobId, @Res() res) {
		const jobRecord = await this.jobsService.getJob(jobId);

		if (!jobRecord) {
			return res.statusCode(500).send({ status: 'No job with such id exists' });
		}

		return { status: jobRecord.status };
	}
}
