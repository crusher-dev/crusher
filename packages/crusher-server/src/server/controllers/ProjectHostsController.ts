import {
	JsonController,
	Get,
	Authorized,
	CurrentUser,
	Body,
	Post,
	Param,
	UnauthorizedError,
	Req,
} from 'routing-controllers';
import { Service, Container, Inject } from 'typedi';
import DBManager from '../../core/manager/DBManager';
import UserService from '../../core/services/UserService';
import ProjectHostsService from '../../core/services/ProjectHostsService';
import ProjectService from '../../core/services/ProjectService';

@Service()
@JsonController('/hosts')
export class ProjectHostsController {
	@Inject()
	private userService: UserService;
	@Inject()
	private projectHostService: ProjectHostsService;
	@Inject()
	private projectService: ProjectService;

	private dbManager: DBManager;

	constructor() {
		// This passes on only one DB containers
		this.dbManager = Container.get(DBManager);
	}

	@Authorized()
	@Post('/create/:projectId')
	async createProjectHost(@CurrentUser({ required: true }) user, @Param('projectId') projectId, @Body() body) {
		const { user_id } = user;
		const { name, url } = body;
		const canAccessThisProject = await this.userService.canAccessProjectId(projectId, user_id);
		if (!canAccessThisProject) {
			throw new UnauthorizedError();
		}

		const host = await this.projectHostService.createHost({
			name,
			url,
			projectId,
			userId: user_id,
		});
		if (host && host.insertId) {
			return { status: 'CREATED_HOST', hostId: host.insertId };
		} else {
			return { status: 'CREATE_HOST_FAILED' };
		}
	}

	@Authorized()
	@Get('/getAll/:projectId')
	async getAllHosts(@CurrentUser({ required: true }) user, @Param('projectId') projectId) {
		const { user_id } = user;
		const canAccessThisProject = await this.userService.canAccessProjectId(projectId, user_id);
		if (!canAccessThisProject) {
			throw new UnauthorizedError();
		}
		return this.projectHostService.getAllHosts(projectId);
	}

	@Authorized()
	@Get('/delete/:hostId')
	async deleteHost(@Param('hostId') hostId) {
		return this.projectHostService.deleteHost(hostId);
	}
}
