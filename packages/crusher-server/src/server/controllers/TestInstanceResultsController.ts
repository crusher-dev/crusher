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
@JsonController('/testInstanceResult')
export class TestInstanceResultsController {
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
	@Get('/approve/:resultSetId/:resultId')
	async approve(@CurrentUser({ required: true }) user, @Param('resultSetId') resultSetId, @Param('resultId') resultId) {
		const { user_id } = user;
		return this.testInstanceResultsService.markResultAsApproved(resultId, user_id).then(async (res) => {
			await res;
			return this.testInstanceResultSetService.updateResultSetStatus(resultSetId);
		});
	}

	@Authorized()
	@Get('/disapprove/:resultSetId/:resultId')
	async disApprove(
		@CurrentUser({ required: true }) user,
		@Param('resultSetId') resultSetId,
		@Param('resultId') resultId,
	) {
		const { user_id } = user;
		return this.testInstanceResultsService.markResultAsRejected(resultId, user_id).then(async (res) => {
			await res;
			return this.testInstanceResultSetService.updateResultSetStatus(resultSetId);
		});
	}
}
