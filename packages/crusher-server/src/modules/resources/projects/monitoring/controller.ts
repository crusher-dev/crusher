import { Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post } from "routing-controllers";
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

	@Authorized()
	@Post("/projects/:project_id/monitorings/:monitoring_id/actions/delete")
	async deleteMonitoring(@Param("monitoring_id") monitoringId: number) {
		if (!monitoringId) throw new BadRequestError("Invalid monitoring id provided");
		await this.monitoringService.deleteMonitoring(monitoringId);

		return {
			status: "Successful",
		};
	}
}

export { ProjectMonitoringController };
