import { Authorized, Body, CurrentUser, JsonController, Post } from "routing-controllers";
import { Container, Inject, Service } from "typedi";
import DBManager from "../../core/manager/DBManager";
import ProjectService from "../../core/services/ProjectService";

const RESPONSE_STATUS = {
	PROJECT_CREATED: "PROJECT_CREATED",
	PROJECT_CREATION_FAILED: "PROJECT_CREATION_FAILED",
};

@Service()
@JsonController("/projects")
export class CreateProjectsController {
	@Inject()
	private projectService: ProjectService;

	private dbManager: DBManager;

	constructor() {
		// This passes on only one DB containers
		this.dbManager = Container.get(DBManager);
	}

	@Authorized()
	@Post("/create")
	async createProject(@CurrentUser({ required: true }) user, @Body() projectDetails) {
		const { projectName } = projectDetails;
		const { team_id } = user;
		return this.projectService
			.createProject(projectName, team_id)
			.then((project) => {
				if (!project) {
					throw new Error("Can't create project");
				}
				return {
					status: RESPONSE_STATUS.PROJECT_CREATED,
					projectId: project.insertId,
				};
			})
			.catch((err) => {
				return { status: RESPONSE_STATUS.PROJECT_CREATION_FAILED };
			});
	}
}
