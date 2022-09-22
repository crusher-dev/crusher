import { Inject, Service } from "typedi";
import { Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post } from "routing-controllers";
import { ProjectsService } from "./service";
import { ProjectWorkspaceService } from "./project.workspace.service";
import { ICreateProjectEnvironmentPayload, ICreateProjectPayload } from "@modules/resources/projects/interface";
import { UsersService } from "../users/service";
import { BuildTestInstancesService } from "../builds/instances/service";
import { TestService } from "../tests/service";
import { userInfo } from "os";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";

@Service()
@JsonController()
class ProjectsController {
	@Inject()
	private projectsService: ProjectsService;
	@Inject()
	private projectWorkspaceService: ProjectWorkspaceService;
	@Inject()
	private testsService: TestService;

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
	@Post("/projects/:project_id/actions/update.emoji")
	async updateEmoji(@Param("project_id") projectId: number, @Body() body: { emoji: string }) {
		if (!body.emoji) throw new BadRequestError("No emoji provided");
		await this.projectsService.updateEmoji(projectId, body.emoji);
		return "Successful";
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

	@Authorized()
	@Post("/projects/:project_id/actions/generate.tests")
	async generateTests(@CurrentUser({ required: true }) userInfo, @Body() body: { url: string }, @Param("project_id") projectId: number) {
		const { user_id } = userInfo;
		if (!body.url) throw new BadRequestError("No url provided");

		await this.testsService.createAndRunTest(
			{
				name: body.url,
				events: [
					{
						type: "BROWSER_SET_DEVICE",
						payload: {
							meta: {
								device: {
									id: "GoogleChromeMediumScreen",
									name: "Desktop",
									width: 1280,
									height: 800,
									mobile: false,
									visible: true,
									userAgent: "Google Chrome",
									userAgentRaw:
										"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
								},
							},
						},
						status: "COMPLETED",
						time: 1650029358631,
					},
					{
						type: "PAGE_NAVIGATE_URL",
						payload: { selectors: [], meta: { value: body.url } },
						status: "COMPLETED",
						time: 1650029359651,
					},
					{ type: "PAGE_SCREENSHOT", payload: {}, status: "COMPLETED", time: 1650029363118 },
				],
			},
			projectId,
			user_id,
		);
		return { status: "Successful" };
	}
}

export { ProjectsController };
