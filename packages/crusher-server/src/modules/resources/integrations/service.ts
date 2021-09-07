import { DBManager } from "@modules/db";
import { SlackOAuthResponse } from "@modules/slack/interface";
import { Inject, Service } from "typedi";

@Service()
class IntegrationsService {
	@Inject()
	private dbManager: DBManager;

	async addSlackIntegration(integrationConfig: SlackOAuthResponse, userId: number) {
		return this.dbManager.insert(`INSERT INTO user_integrations SET ?`, {
			user_id: userId,
			label: `${integrationConfig.team.name}___${integrationConfig.incoming_webhook.channel}`,
			access_token: integrationConfig.access_token,
			webhook_url: integrationConfig.incoming_webhook.url,
			meta: JSON.stringify(integrationConfig),
		});
	}
}

export { IntegrationsService };
