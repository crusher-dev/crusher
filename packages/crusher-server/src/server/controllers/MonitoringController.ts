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
import MonitoringService from '../../core/services/MonitoringService';
import { Platform } from '../../core/interfaces/Platform';
import { convertLabelToSeconds, convertSecondsToLabel } from '../../core/utils/helper';

@Service()
@JsonController('/monitoring')
export class MonitoringController {
	@Inject()
	private userService: UserService;

	@Inject()
	private monitoringService: MonitoringService;

	private dbManager: DBManager;

	constructor() {
		// This passes on only one DB containers
		this.dbManager = Container.get(DBManager);
	}

	@Authorized()
	@Post('/settings/:projectId/save')
	async createProjectHost(@CurrentUser({ required: true }) user, @Param('projectId') projectId, @Body() body) {
		const { user_id } = user;
		const { test_interval, platform, target_host } = body;
		const canAccessThisProject = await this.userService.canAccessProjectId(projectId, user_id);
		if (!canAccessThisProject) {
			throw new UnauthorizedError();
		}

		await this.monitoringService.saveSettingsForProject(
			{
				test_interval: convertLabelToSeconds(test_interval),
				platform,
				target_host,
				project_id: projectId,
				last_cron_run: new Date(null),
				user_id: user_id,
			},
			projectId,
		);

		return { status: 'UPDATED' };
	}

	@Authorized()
	@Get('/settings/:projectId/get')
	async getAllHosts(@CurrentUser({ required: true }) user, @Param('projectId') projectId) {
		const { user_id } = user;
		const canAccessThisProject = await this.userService.canAccessProjectId(projectId, user_id);
		if (!canAccessThisProject) {
			throw new UnauthorizedError();
		}
		const monitoringSettings = await this.monitoringService.getSettingsForProject(projectId);
		return {
			...monitoringSettings,
			test_interval: convertSecondsToLabel(monitoringSettings.test_interval),
		};
	}
}
