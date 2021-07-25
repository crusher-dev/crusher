import { Container, Inject, Service } from "typedi";
import { Authorized, Body, CurrentUser, Get, JsonController, NotFoundError, OnNull, OnUndefined, Param, Put } from "routing-controllers";
import UserService from "../../../core/services/UserService";
import ProjectService from "../../../core/services/ProjectService";
import TestService from "../../../core/services/TestService";
import JobsService from "../../../core/services/JobsService";
import DBManager from "../../../core/manager/DBManager";
import ProjectHostsService from "../../../core/services/ProjectHostsService";
import { JOB_TRIGGER } from "../../../../../crusher-shared/types/jobTrigger";
import { PLATFORM } from "../../../../../crusher-shared/types/platform";
import JobRunnerService from "../../../core/services/v2/JobRunnerService";

@Service()
@JsonController("/v2/currentProject")
export class ProjectsControllerV2 {
	@Inject()
	private userService: UserService;
	@Inject()
	private projectService: ProjectService;
	@Inject()
	private testService: TestService;
	@Inject()
	private jobService: JobsService;
	@Inject()
	private projectHostsService: ProjectHostsService;
	@Inject()
	private jobRunnerService: JobRunnerService;

	private dbManager: DBManager;

	constructor() {
		// This passes on only one DB containers
		this.dbManager = Container.get(DBManager);
	}

	@Get("/get/:projectId")
	@OnNull(404)
	async getProjectInfo(@Param("projectId") projectId: number) {
		return this.projectService.getProject(projectId);
	}

	@Authorized()
	@Get("/get/members/:projectId")
	@OnNull(404)
	async getProjectMembers(@CurrentUser({ required: true }) user, @Param("projectId") projectId: number) {
		return this.projectService.getProjectMembers(projectId);
	}

	@Put("/update/:projectId")
	async updateProjectInfo(@Param("projectId") projectId: number, @Body() body: any) {
		const { info } = body;
		return {
			status: "DONE",
			response: this.projectService.updateProjectName(info.name, projectId),
		};
	}

	@Authorized()
	@Get("/run/:projectId")
	async runTests(@CurrentUser({ required: true }) user, @Param("projectId") projectId: number) {
		const { user_id } = user;
		const projectHosts = await this.projectHostsService.getAllHosts(projectId);
		if (!projectHosts.length) {
			throw new Error("No currentProject hosts created to run");
		}
		await this.jobRunnerService.runTestsInProject(projectId, PLATFORM.CHROME, JOB_TRIGGER.MANUAL, user_id, projectHosts[0], null);
		return "Running";
	}
}
