import { DBManager } from "@modules/db";
import { Get, JsonController, Param } from "routing-controllers";
import { Inject, Service } from "typedi";
import { ProjectMonitoringService } from "./service";

@Service()
@JsonController()
class MonitoringController {
	@Inject()
	private monitoringService: ProjectMonitoringService;

	@Get("/project/:project_id/monitorings")
	async getMonitoringList(@Param("project_id") projectId: number) {
		return this.monitoringService.getMonitoringList(projectId);
	}
}

export { MonitoringController }