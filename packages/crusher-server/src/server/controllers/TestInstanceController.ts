import {
	JsonController,
	Get,
	Authorized,
	CurrentUser,
	Body,
	Post,
	UnauthorizedError,
	Param,
	BadRequestError,
	Req,
} from 'routing-controllers';
import { Service, Container, Inject } from 'typedi';
import DBManager from '../../core/manager/DBManager';
import UserService from '../../core/services/UserService';
import ProjectService from '../../core/services/ProjectService';
import TestService from '../../core/services/TestService';
import TestInstanceService from '../../core/services/TestInstanceService';
import JobsService from '../../core/services/JobsService';
import { getDefaultHostFromCode } from '../../core/utils/helper';

const TEST_INSTANCE_STATUS = {
	CREATED: 'CREATED',
	SKIPPED: 'SKIPPED',
	ABORTED: 'ABORTED',
	FINISHED: 'FINISHED',
};

const TEST_RESULT_STATUS = {
	PASSED: 'PASSED',
	NO_REFERENCE_TEST: 'NO_REFERENCE_TEST',
	NO_TEST_INSTANCE: 'NO_TEST_INSTANCE',
	FAILED: 'FAILED',
};

@Service()
@JsonController('/test_instance')
export class TestInstanceController {
	@Inject()
	private userService: UserService;
	@Inject()
	private testInstanceService: TestInstanceService;
	@Inject()
	private projectService: ProjectService;
	@Inject()
	private buildsService: JobsService;

	private dbManager: DBManager;

	constructor() {
		// This passes on only one DB containers
		this.dbManager = Container.get(DBManager);
	}

	@Authorized()
	@Get('/getAll/:testId')
	async getAllTestInstances(@Param('testId') testId: number, @CurrentUser({ required: true }) user) {
		const { user_id } = user;
		const canAccessThisTest = await this.userService.canAccessTestWithID(testId, user_id);
		if (canAccessThisTest) {
			return this.testInstanceService.getAllTestInstances(testId);
		} else {
			throw new UnauthorizedError('User not authorized to access test with this id.');
		}
	}

	@Authorized()
	@Post('/updateTestInstance/:id')
	async updateTestInstance(@Param('id') testInstanceId: number, @Body() body, @CurrentUser({ required: true }) user) {
		const { user_id } = user;
		const { status } = body;

		const canAccessTestInstance = await this.userService.canAccessTestInstanceWithId(testInstanceId, user_id);
		if (canAccessTestInstance) {
			return this.testInstanceService.updateTestInstanceStatus(status, testInstanceId);
		} else {
			throw new UnauthorizedError('User not authorized to access test instance with this id.');
		}
	}

	@Authorized()
	@Get('/getVisualDiffWithLastInstance/:testId')
	async getVisualDiffWithLastInstance(@CurrentUser({ required: true }) user, @Param('testId') testId) {
		const { user_id } = user;
		const canAccessTestInstance = await this.userService.canAccessTestWithID(testId, user_id);
		const instances = await this.testInstanceService.getAllTestInstances(testId);
		if (!instances || instances.length === 0) {
			return { status: TEST_RESULT_STATUS.NO_TEST_INSTANCE };
		}
		if (instances && instances.length === 1) {
			return { status: TEST_RESULT_STATUS.NO_REFERENCE_TEST };
		}
		const currentTest = instances[0];
		const referenceTest = instances[1];
	}
}
