import { DBManager } from "@modules/db";
import { userInfo } from "os";
import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post } from "routing-controllers";
import { Inject, Service } from "typedi";
import { ICreateEnvironmentPayload } from "./interface";
import { ProjectEnvironmentService } from "./service";

@Service()
@JsonController()
class ProjectEnvironmentController {
	@Inject()
	private environmentService: ProjectEnvironmentService;

	@Get("/projects/:project_id/environments")
	async getMonitoringList(@Param("project_id") projectId: number) {
		return this.environmentService.getEnvironmentsList(projectId);
	}

	@Authorized()
	@Post("/projects/:project_id/environments/actions/create")
	async createMonitoring(@CurrentUser({required: true}) userInfo, @Param("project_id") projectId: number, @Body() body: Omit<ICreateEnvironmentPayload, "projectId"> ) {
		const environmentInsertRecord = await this.environmentService.createEnvironment({
            ...body,
            projectId,   
        });
        const environmentRecord = await this.environmentService.getEnvironment(environmentInsertRecord.insertId);

        return {
            status: "Successful",
            ...environmentRecord,
        }
	}
}

export { ProjectEnvironmentController }