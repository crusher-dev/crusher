import { Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { ICreateMonitoringPayload, IMonitoringTable, IQueuedMonitoringsDetails, IUpdateMonitoringPayload } from "./interface";
import { BadRequestError } from "routing-controllers";
import { getInsertOrUpdateQuerySetFromObject, getSnakedObject } from "@utils/helper";
@Service()
class ProjectMonitoringService {
	@Inject()
	private dbManager: DBManager;

	@CamelizeResponse()
	async getMonitoringList(projectId: number): Promise<Array<KeysToCamelCase<IMonitoringTable>>> {
		return this.dbManager.fetchAllRows("SELECT * FROM public.monitorings WHERE project_id = ?", [projectId]);
	}

	async createMonitoring(payload: ICreateMonitoringPayload): Promise<{ insertId: number }> {
		return this.dbManager.insert("INSERT INTO public.monitorings (project_id, environment_id, test_interval) VALUES (?, ?, ?)", [
			payload.projectId,
			payload.environmentId,
			payload.testInterval,
		]);
	}

	@CamelizeResponse()
	async getMonitoring(monitoringId: number): Promise<KeysToCamelCase<IMonitoringTable>> {
		return this.dbManager.fetchSingleRow("SELECT * FROM public.monitorings WHERE id = ?", [monitoringId]);
	}

	@CamelizeResponse()
	async getQueuedMonitoringDetails(): Promise<IQueuedMonitoringsDetails> {
		return this.dbManager.fetchAllRows(
			`SELECT monitorings.id id, e.user_id user_id, monitorings.project_id project_id, monitorings.environment_id environment_id, monitorings.test_interval test_interval, monitorings.last_cron_run last_cron_run, e.name environment_name, e.browser environment_browser, e.vars environment_vars FROM public.monitorings INNER JOIN environments e on monitorings.environment_id = e.id WHERE EXTRACT(EPOCH FROM (NOW() - monitorings.last_cron_run)) > monitorings.test_interval`,
		);
	}

	async updateLastCronMarker(monitoringId: number) {
		return this.dbManager.update(`UPDATE public.monitorings SET last_cron_run = NOW() WHERE id = ?`, [monitoringId]);
	}

	async deleteMonitoring(monitoringId: number) {
		return this.dbManager.delete("DELETE FROM public.monitorings WHERE id = ?", [monitoringId]);
	}

	async deleteAllMonitoringsOfEnvironment(environmentId: number) {
		return this.dbManager.delete("DELETE FROM public.monitorings WHERE environment_id = ?", [environmentId]);
	}

	private validateUpdatePayload(payload: IUpdateMonitoringPayload) {
		if (!payload) throw new BadRequestError("Invalid update payload");

		const payloadKeys = Object.keys(payload);
		const validKeys = Object.keys(payload).filter((key) => {
			return ["environmentId", "testInterval"].includes(key);
		});

		if (validKeys.length !== payloadKeys.length) throw new BadRequestError("Invalid update payload");
	}

	async updateMonitoring(payload: IUpdateMonitoringPayload, monitoringId: number) {
		this.validateUpdatePayload(payload);

		const [setQuery, setQueryValues] = getInsertOrUpdateQuerySetFromObject(getSnakedObject(payload));

		return this.dbManager.update(`UPDATE public.monitorings SET ${setQuery} WHERE id = ?`, [...setQueryValues, monitoringId]);
	}
}

export { ProjectMonitoringService };
