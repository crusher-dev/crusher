import { DBManager } from "@modules/db";
import { userInfo } from "os";
import { Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post } from "routing-controllers";
import { Inject, Service } from "typedi";
import { ProjectMonitoringService } from "../monitoring/service";
import { ICreateEnvironmentPayload } from "./interface";
import { ProjectEnvironmentService } from "./service";

@Service()
@JsonController()
class ProjectEnvironmentController {
	@Inject()
	private environmentService: ProjectEnvironmentService;
	@Inject()
	private monitoringService: ProjectMonitoringService;

	@Get("/projects/:project_id/environments")
	async getEnvironmentsList(@Param("project_id") projectId: number) {
		return this.environmentService.getEnvironmentsList(projectId);
	}

	@Authorized()
	@Post("/projects/:project_id/environments/actions/create")
	async createEnvironment(
		@CurrentUser({ required: true }) userInfo,
		@Param("project_id") projectId: number,
		@Body() body: Omit<ICreateEnvironmentPayload, "projectId">,
	) {
		const environmentInsertRecord = await this.environmentService.createEnvironment({
			...body,
			projectId,
			userId: userInfo.user_id,
		});
		const environmentRecord = await this.environmentService.getEnvironment(environmentInsertRecord.insertId);

		return {
			status: "Successful",
			...environmentRecord,
		};
	}

	@Authorized()
	@Post("/projects/:project_id/environments/:environment_id/actions/delete")
	async deleteEnvironment(@Param("environment_id") environmentId: number) {
		if (!environmentId) throw new BadRequestError("Invalid environment id provided");
		await this.monitoringService.deleteAllMonitoringsOfEnvironment(environmentId);
		await this.environmentService.deleteEnvironment(environmentId);

		return {
			status: "Successful",
		};
	}
}

export { ProjectEnvironmentController };
