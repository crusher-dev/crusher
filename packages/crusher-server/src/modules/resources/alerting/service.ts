import { DBManager } from "@modules/db";
import { Inject, Service } from "typedi";
import { ICreateProjectAlertingPayload } from "./interface";

@Service()
class AlertingService {
	@Inject()
	private dbManager: DBManager;

	async addAlertIntegrationToProject(payload: ICreateProjectAlertingPayload) {
		return this.dbManager.insert("INSERT INTO integration_alerting (project_id, integration_id, user_id, config) VALUES (?, ?, ?, ?)", [
			payload.projectId,
			payload.integrationId,
			payload.userId,
			JSON.stringify(payload.config),
		]);
	}
}

export { AlertingService };
