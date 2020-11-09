import { JsonController, Authorized, CurrentUser, Body, Post, Get, Param } from 'routing-controllers';
import { Service, Container, Inject } from 'typedi';
import DBManager from '../../core/manager/DBManager';
import UserService from '../../core/services/UserService';
import ProjectHostsService from '../../core/services/ProjectHostsService';
import ProjectService from '../../core/services/ProjectService';
import CommentsService from '../../core/services/CommentsService';
import TestInstanceResultsService from '../../core/services/TestInstanceResultsService';
import TestInstanceService from '../../core/services/TestInstanceService';
import JobsService from '../../core/services/JobsService';
import TestInstanceResultSetsService from '../../core/services/TestInstanceResultSetsService';

@Service()
@JsonController('/testInstanceResultSet')
export class TestInstanceResultSetsController {
	@Inject()
	private userService: UserService;
	@Inject()
	private projectHostService: ProjectHostsService;
	@Inject()
	private projectService: ProjectService;
	@Inject()
	private commentsService: CommentsService;
	@Inject()
	private testInstanceResultsService: TestInstanceResultsService;
	@Inject()
	private testInstanceResultSetService: TestInstanceResultSetsService;
	@Inject()
	private testInstanceService: TestInstanceService;
	@Inject()
	private jobsService: JobsService;

	private dbManager: DBManager;

	constructor() {
		// This passes on only one DB containers
		this.dbManager = Container.get(DBManager);
	}

	@Authorized()
	@Get('/approveAll/:jobId')
	async approveAll(@CurrentUser({ required: true }) user, @Param('jobId') jobId) {
		const { user_id } = user;
		const job = await this.jobsService.getJob(jobId);
		const testInstances = await this.testInstanceService.getAllInstancesWithResultByJobIdWithoutPlatfom(jobId);

		const testInstancesMap = testInstances.reduce((prev, current) => {
			return { ...prev, [current.resultSetId]: true };
		}, {});

		await Promise.all(
			Object.keys(testInstances).map((resultSetId) => {
				return this.testInstanceResultsService.markResultAsApproved(parseInt(resultSetId), user_id).then((res) => {
					return this.testInstanceResultSetService.updateResultSetStatus(parseInt(resultSetId));
				});
			}),
		);
	}
}
