import { Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { IProjectMonitoringTable } from "./interface";

@Service()
class ProjectMonitoringService {
	@Inject()
	private dbManager: DBManager;

	@CamelizeResponse()
	async getMonitoringList(projectId: number): Promise<Array<KeysToCamelCase<IProjectMonitoringTable>>> {
		return this.dbManager.fetchAllRows("SELECT * FROM monitoring_settings WHERE project_id = ?", [projectId]);
	}
}

export { ProjectMonitoringService };
