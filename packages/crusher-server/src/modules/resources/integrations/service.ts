import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { SlackOAuthResponse } from "@modules/slack/interface";
import { SlackService } from "@modules/slack/service";
import { BadRequestError } from "routing-controllers";
import { Inject, Service } from "typedi";
import { IIntegrationsTable, IntegrationServiceEnum } from "./interface";

@Service()
class IntegrationsService {
	@Inject()
	private dbManager: DBManager;
	@Inject()
	private slackService: SlackService;

	async addIntegration(integrationConfig: any, integrationName: IntegrationServiceEnum, projectId: number) {
		return this.dbManager.insert(`INSERT INTO public.integrations (project_id, integration_name, meta) VALUES (?, ?, ?)`, [
			projectId,
			integrationName,
			JSON.stringify(integrationConfig),
		]);
	}

	async updateIntegration(integrationConfig: any, id: number) {
		return this.dbManager.update(`UPDATE public.integrations SET meta = ? WHERE id = ?`, [JSON.stringify(integrationConfig), id]);
	}

	async deleteIntegration(id: number) {
		return this.dbManager.delete(`DELETE FROM public.integrations WHERE id = ?`, [id]);
	}

	@CamelizeResponse()
	async getSlackIntegration(projectId: number): Promise<KeysToCamelCase<IIntegrationsTable>> {
		return this.dbManager.fetchSingleRow("SELECT * FROM public.integrations WHERE project_id = ? AND integration_name = ?", [
			projectId,
			IntegrationServiceEnum.SLACK,
		]);
	}

	@CamelizeResponse()
	async getVercelIntegration(projectId: number): Promise<KeysToCamelCase<IIntegrationsTable>> {
		return this.dbManager.fetchSingleRow("SELECT * FROM public.integrations WHERE project_id = ? AND integration_name = ?", [
			projectId,
			IntegrationServiceEnum.VERCEL,
		]);
	}

	@CamelizeResponse()
	async getListOfIntegrations(projectId: number): Promise<Array<KeysToCamelCase<IIntegrationsTable>>> {
		return this.dbManager.fetchAllRows("SELECT * FROM public.integrations WHERE project_id = ?", [projectId]);
	}

	async saveSlackSettings(payload: { alertChannel: any; normalChannel: any }, projectId: number) {
		const existingSlackIntegration = await this.getSlackIntegration(projectId);
		if (!existingSlackIntegration) throw new BadRequestError("No slack integration found");
		const integrationConfig = existingSlackIntegration.meta;

		if (!integrationConfig.channel) {
			integrationConfig.channel = {};
		}
		integrationConfig.channel["alert"] = payload.alertChannel ? payload.alertChannel : null;
		integrationConfig.channel["normal"] = payload.normalChannel ? payload.normalChannel : null;

		return this.updateIntegration(integrationConfig, existingSlackIntegration.id);
	}

	async postSlackMessageIfNeeded(projectId: number, blocks: Array<any>, type: "alert" | "normal") {
		const integration = await this.getSlackIntegration(projectId);
		if (!integration) return;
		const integrationConfig = integration.meta;
		if (!integrationConfig.channel[type]) return;
		return this.slackService.postMessage(blocks, integrationConfig.channel[type].value, integrationConfig.oAuthInfo.accessToken);
	}
}

export { IntegrationsService };
