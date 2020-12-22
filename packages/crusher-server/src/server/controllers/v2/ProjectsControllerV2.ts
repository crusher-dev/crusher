import { Container, Inject, Service } from "typedi";
import { Body, Get, JsonController, NotFoundError, OnNull, OnUndefined, Param, Put } from "routing-controllers";
import UserService from "../../../core/services/UserService";
import ProjectService from "../../../core/services/ProjectService";
import TestService from "../../../core/services/TestService";
import JobsService from "../../../core/services/JobsService";
import DBManager from "../../../core/manager/DBManager";

@Service()
@JsonController("/v2/project")
export class ProjectsControllerV2 {
	@Inject()
	private userService: UserService;
	@Inject()
	private projectService: ProjectService;
	@Inject()
	private testService: TestService;
	@Inject()
	private jobService: JobsService;

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

	@Put("/update/:projectId")
	async updateProjectInfo(@Param("projectId") projectId: number, @Body() body: any) {
		const {info} = body;
		return {
			status: "DONE",
			response: this.projectService.updateProjectName(info.name, projectId)
		};
	}
}
