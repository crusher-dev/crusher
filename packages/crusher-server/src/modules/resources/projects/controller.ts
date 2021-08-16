import { Inject, Service } from "typedi";
import { Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post } from "routing-controllers";
import { ProjectsService } from "./service";
import { ICreateProjectEnvironmentPayload, ICreateProjectPayload } from "@modules/resources/projects/interface";
import { UsersService } from "../users/service";

@Service()
@JsonController()
class ProjectsController {
	@Inject()
	private projectsService: ProjectsService;
	@Inject()
	private usersService: UsersService;

	@Authorized()
	@Post("/projects/actions/create")
	async createProject(@CurrentUser({ required: true }) user, @Body() body: ICreateProjectPayload) {
		const result = await this.projectsService.createProject({
			name: body.name,
			teamId: user.team_id,
		});

		const project = await this.projectsService.getProject(result.insertId);
		if (!project) throw new BadRequestError("No such project found");

		return {
			...project,
			meta: project.meta ? JSON.parse(project.meta) : null,
		};
	}

	@Authorized()
	@Get("/projects/:project_id")
	async getProject(@Param("project_id") projectId: number) {
		const project = await this.projectsService.getProject(projectId);
		if (!project) throw new BadRequestError("No such project found");

		return {
			...project,
			meta: project.meta ? JSON.parse(project.meta) : null,
		};
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

	@Authorized()
	@Post("/projects/:project_id/actions/update.meta")
	async updateMeta(@CurrentUser({ required: true }) user, @Param("project_id") projectId: number, @Body() body: { meta: any }) {
		if (typeof body.meta !== "object") throw new BadRequestError("meta is not JSON compatible");
		const projectRecord = await this.projectsService.getProject(projectId);
		const finalMeta = projectRecord.meta ? { ...JSON.parse(projectRecord.meta), ...body } : body.meta;

		await this.projectsService.updateMeta(JSON.stringify(finalMeta), projectId);
		return "Successful";
	}
}

export { ProjectsController };
