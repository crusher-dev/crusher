import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post } from "routing-controllers";
import { Inject, Service } from "typedi";
import { ICreateMonitoringPayload } from "./interface";
import { ProjectMonitoringService } from "./service";

@Service()
@JsonController()
class ProjectMonitoringController {
	@Inject()
	private monitoringService: ProjectMonitoringService;

	@Get("/projects/:project_id/monitorings")
	async getMonitoringList(@Param("project_id") projectId: number) {
		return this.monitoringService.getMonitoringList(projectId);
	}

	@Authorized()
	@Post("/projects/:project_id/monitorings/actions/create")
	async createMonitoring(
		@CurrentUser({ required: true }) userInfo,
		@Param("project_id") projectId: number,
		@Body() body: Omit<ICreateMonitoringPayload, "projectId">,
	) {
		const monitoringInsertRecord = await this.monitoringService.createMonitoring({
			...body,
			projectId,
		});

		const monitoringRecord = await this.monitoringService.getMonitoring(monitoringInsertRecord.insertId);

		return {
			status: "Successful",
			...monitoringRecord,
		};
	}
}

export { ProjectMonitoringController };
