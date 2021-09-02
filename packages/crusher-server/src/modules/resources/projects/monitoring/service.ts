import { Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { ICreateMonitoringPayload, IMonitoringTable } from "./interface";

@Service()
class ProjectMonitoringService {
	@Inject()
	private dbManager: DBManager;

	@CamelizeResponse()
	async getMonitoringList(projectId: number): Promise<Array<KeysToCamelCase<IMonitoringTable>>> {
		return this.dbManager.fetchAllRows("SELECT * FROM monitorings WHERE project_id = ?", [projectId]);
	}

	async createMonitoring(payload: ICreateMonitoringPayload): Promise<{ insertId: number }> {
		return this.dbManager.insert("INSERT INTO monitorings SET project_id = ?, environment_id = ?, test_interval = ?", [
			payload.projectId,
			payload.environmentId,
			payload.testInterval,
		]);
	}

	@CamelizeResponse()
	async getMonitoring(monitoringId: number): Promise<KeysToCamelCase<IMonitoringTable>> {
		return this.dbManager.fetchSingleRow("SELECT * FROM monitorings WHERE id = ?", [monitoringId]);
	}
}

export { ProjectMonitoringService };
