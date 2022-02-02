import { Inject, Service } from "typedi";
import { Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post } from "routing-controllers";
import { ProjectsService } from "./service";
import { ProjectWorkspaceService } from "./project.workspace.service";
import { ICreateProjectEnvironmentPayload, ICreateProjectPayload } from "@modules/resources/projects/interface";
import { UsersService } from "../users/service";

@Service()
@JsonController()
class ProjectsController {
	@Inject()
	private projectsService: ProjectsService;
	@Inject()
	private projectWorkspaceService: ProjectWorkspaceService;

	@Authorized()
	@Post("/projects/actions/create")
	async createProject(@CurrentUser({ required: true }) user, @Body() body: ICreateProjectPayload) {
		const projectRecord = await this.projectsService.getTeamProjectByName(body.name, user.team_id);
		if (projectRecord) return { ...projectRecord, meta: projectRecord.meta ? JSON.parse(projectRecord.meta) : null };
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
	@Post("/projects/:project_id/actions/update.meta")
	async updateMeta(@CurrentUser({ required: true }) user, @Param("project_id") projectId: number, @Body() body: { meta: any }) {
		if (typeof body.meta !== "object") throw new BadRequestError("meta is not JSON compatible");
		const projectRecord = await this.projectsService.getProject(projectId);
		const finalMeta = projectRecord.meta ? { ...JSON.parse(projectRecord.meta), ...body.meta } : body.meta;

		await this.projectsService.updateMeta(JSON.stringify(finalMeta), projectId);
		return "Successful";
	}

	@Authorized()
	@Post("/projects/:project_id/actions/delete")
	async deleteProjectWorkspace(@Param("project_id") projectId: number) {
		await this.projectWorkspaceService.deleteWorkspace(projectId);
		return "Successful";
	}

	@Authorized()
	@Post("/projects/:project_id/actions/update.settings")
	async setDiffBaseOffset(@Param("project_id") projectId: number, @Body() body: { visualBaseline: number; name: string }) {
		console.log("Body is", body);
		if (!body.visualBaseline) throw new BadRequestError("No diff base offset provided");
		if (!body.name) throw new BadRequestError("No name provided");

		await this.projectsService.updateProjectName(body.name, projectId);
		await this.projectsService.updateVisualBaseline(body.visualBaseline, projectId);
		return "Successful";
	}
}

export { ProjectsController };
