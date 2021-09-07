import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { SlackOAuthResponse } from "@modules/slack/interface";
import { Inject, Service } from "typedi";
import { IIntegrationsTable } from "./interface";

@Service()
class IntegrationsService {
	@Inject()
	private dbManager: DBManager;

	async addSlackIntegration(integrationConfig: SlackOAuthResponse, projectId: number) {
		return this.dbManager.insert(`INSERT INTO integrations SET project_id = ?, meta = ?`, [projectId, JSON.stringify(integrationConfig)]);
	}

	@CamelizeResponse()
	async getListOfIntegrations(projectId: number): Promise<Array<KeysToCamelCase<IIntegrationsTable>>> {
		return this.dbManager.fetchAllRows("SELECT * FROM integrations WHERE project_id = ?", [projectId]);
	}
}

export { IntegrationsService };
