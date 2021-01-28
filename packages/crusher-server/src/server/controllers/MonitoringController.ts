import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, UnauthorizedError } from "routing-controllers";
import { Container, Inject, Service } from "typedi";
import DBManager from "../../core/manager/DBManager";
import UserService from "../../core/services/UserService";
import MonitoringService from "../../core/services/MonitoringService";
import { convertLabelToSeconds, convertSecondsToLabel } from "../../core/utils/helper";
import { Platform } from "../../core/interfaces/Platform";
import { iAddMonitoringRequest } from "../../../../crusher-shared/types/request/addMonitoringRequest";
import { iMonitoringListResponse } from "../../../../crusher-shared/types/response/monitoringListResponse";
import ProjectHostsService from "../../core/services/ProjectHostsService";
import JobRunnerService from "../../core/services/v2/JobRunnerService";
import { JOB_TRIGGER } from "../../../../crusher-shared/types/jobTrigger";

@Service()
@JsonController("/monitoring")
export class MonitoringController {
	@Inject()
	private userService: UserService;
	@Inject()
	private monitoringService: MonitoringService;
	@Inject()
	private projectHostsService: ProjectHostsService;
	@Inject()
	private jobRunnerService: JobRunnerService;

	private dbManager: DBManager;

	constructor() {
		// This passes on only one DB containers
		this.dbManager = Container.get(DBManager);
	}

	@Authorized()
	@Post("/add/:projectId")
	async addMonitoring(@CurrentUser({ required: true }) user, @Param("projectId") projectId: number, @Body() body: iAddMonitoringRequest) {
		const { user_id } = user;
		const { host, interval, tags } = body;

		return this.monitoringService.addMonitoringForProject(
			{
				test_interval: interval,
				platform: Platform.ALL,
				target_host: host,
				project_id: projectId,
				last_cron_run: new Date(null),
				user_id: user_id,
			},
			projectId,
		);
	}

	@Authorized()
	@Get("/get/:projectId")
	async getMonitoringList(@CurrentUser({ required: true }) user, @Param("projectId") projectId: number): Promise<Array<iMonitoringListResponse>> {
		return this.monitoringService.getMonitoringListForProject(projectId);
	}

	@Authorized()
	@Post("/settings/:projectId/save")
	async createProjectHost(@CurrentUser({ required: true }) user, @Param("projectId") projectId, @Body() body) {
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

		return { status: "UPDATED" };
	}

	@Authorized()
	@Get("/settings/:projectId/get")
	async getAllHosts(@CurrentUser({ required: true }) user, @Param("projectId") projectId) {
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

	@Authorized()
	@Get("/run/:monitoringId")
	async runProjectsInHost(@Param("monitoringId") monitoringId) {
		const monitoring = await this.monitoringService.getMonitoring(monitoringId);
		const host = await this.projectHostsService.getHost(monitoring.target_host);
		await this.jobRunnerService.runTestsInProject(monitoring.project_id, monitoring.platform, JOB_TRIGGER.MANUAL, monitoring.user_id, host, null);
		return true;
	}
}
