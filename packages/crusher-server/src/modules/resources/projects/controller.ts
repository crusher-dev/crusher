import { Inject, Service } from "typedi";
import { Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post } from "routing-controllers";
import { ProjectsService } from "./service";
import { ICreateProjectEnvironmentPayload, ICreateProjectPayload } from "@modules/resources/projects/interface";

@Service()
@JsonController()
class ProjectsController {
	@Inject()
	private projectsService: ProjectsService;

	@Authorized()
	@Post("/projects/actions/create")
	async createProject(@CurrentUser({ required: true }) user, @Body() body: ICreateProjectPayload) {
		return this.projectsService.createProject({
			name: body.name,
			teamId: user.team_id,
		});
	}

	@Authorized()
	@Get("/projects/:project_id/environments")
	async getProjectEnvironments(@Param("project_id") projectId: number) {
		return this.projectsService.getProjectEnvironments(projectId);
	}

	@Authorized()
	@Post("/projects/:project_id/environments/actions/create")
	async createProjectEnvironment(
		@CurrentUser({ required: true }) user,
		@Param("project_id") projectId: number,
		@Body() body: Omit<ICreateProjectEnvironmentPayload, "projectId" | "userId">,
	) {
		const result = await this.projectsService.createProjectEnvironment({
			...body,
			projectId: projectId,
			userId: user.user_id,
		});
		if (!result.insertId) throw new BadRequestError("Could not create project environment");

		return { insertId: result.insertId };
	}
}
