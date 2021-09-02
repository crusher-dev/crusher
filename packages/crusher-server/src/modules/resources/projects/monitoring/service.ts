import { Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { ICreateMonitoringPayload, IMonitoringTable, IQueuedMonitoringsDetails, IUpdateMonitoringPayload } from "./interface";
import { BadRequestError } from "routing-controllers";
import { getSnakedObject } from "@utils/helper";
import { is } from "typescript-is";
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

	@CamelizeResponse()
	async getQueuedMonitoringDetails(): Promise<IQueuedMonitoringsDetails> {
		return this.dbManager.fetchAllRows(
			`SELECT monitorings.id id, e.user_id userId, monitorings.project_id project_id, monitorings.environment_id environment_id, monitorings.test_interval test_interval, monitorings.last_cron_run last_cron_run, e.name environment_name, e.browser environment_browser, e.vars environment_vars FROM monitorings INNER JOIN environments e on monitorings.environment_id = e.id WHERE UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(monitorings.last_cron_run) > monitorings.test_interval`,
		);
	}

	async updateLastCronMarker(monitoringId: number) {
		return this.dbManager.update(`UPDATE monitorings SET last_cron_run = NOW() WHERE id = ?`, [monitoringId]);
	}

	async deleteMonitoring(monitoringId: number) {
		return this.dbManager.delete("DELETE FROM monitorings WHERE id = ?", [monitoringId]);
	}

	async deleteAllMonitoringsOfEnvironment(environmentId: number) {
		return this.dbManager.delete("DELETE FROM monitorings WHERE environment_id = ?", [environmentId]);
	}

	async updateMonitoring(payload: IUpdateMonitoringPayload, monitoringId: number) {
		if (is<IUpdateMonitoringPayload>(payload)) throw new BadRequestError("Invalid update payload provided");

		return this.dbManager.update(`UPDATE environments SET ? WHERE id = ?`, [getSnakedObject(payload), monitoringId]);
	}
}

export { ProjectMonitoringService };
