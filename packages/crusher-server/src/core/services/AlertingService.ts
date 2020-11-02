import { Service, Container } from 'typedi';
import DBManager from '../manager/DBManager';
import { fetch } from '../utils/fetch';
import { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET } from '../../../config/slack';
import { SlackOAuthResponse } from '../interfaces/SlackOAuthResponse';

@Service()
export default class AlertingService {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async fetchRow(userId) {
		return this.dbManager.fetchSingleRow(`SELECT * FROM alerting WHERE user_id = ?`, [userId]);
	}

	async createRowIfNotThere(userId) {
		const row = await this.fetchRow(userId);
		if (!!row === false) {
			await this.dbManager.insertData(`INSERT INTO alerting SET ?`, [{ user_id: userId }]);
		}
	}

	async addGithubCode(code: string, userId: number) {
		await this.createRowIfNotThere(userId);
		return this.dbManager.fetchSingleRow(`UPDATE alerting SET ? WHERE user_id = ?`, [{ github_code: code }, userId]);
	}

	async getSlackAccessConfig(code: string): Promise<SlackOAuthResponse> {
		// const params = {code: code, client_id: SLACK_CLIENT_ID, client_secret: SLACK_CLIENT_SECRET};
		const data = new URLSearchParams();
		data.append('code', code);
		data.append('client_id', SLACK_CLIENT_ID);
		data.append('client_secret', SLACK_CLIENT_SECRET);

		return fetch('https://slack.com/api/oauth.v2.access', {
			method: 'POST',
			header: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: data,
		}).then((res) => {
			return res as any;
		});
	}

	async addSlackIntegration(config: SlackOAuthResponse, user_id) {
		return this.dbManager.insertData(`INSERT INTO user_integrations SET ?`, {
			user_id: user_id,
			integration_name: 'SLACK',
			label: `${config.team.name}___${config.incoming_webhook.channel}`,
			access_token: config.access_token,
			webhook_url: config.incoming_webhook.url,
			meta_info: JSON.stringify(config),
		});
	}

	async addAlertIntegrationToProject(
		integration_id: number,
		project_id: number,
		user_id: number,
		config: SlackOAuthResponse,
	) {
		return this.dbManager.insertData('INSERT INTO integration_alerting SET ?', {
			project_id,
			integration_id,
			user_id,
			config: JSON.stringify(config),
		});
	}

	async getSlackIntegrationsInProject(project_id: number) {
		return this.dbManager.fetchData(
			`SELECT integration_alerting.*, user_integrations.label, user_integrations.webhook_url as webhook_url FROM integration_alerting, user_integrations WHERE integration_alerting.project_id = ? AND integration_alerting.integration_id = user_integrations.id AND user_integrations.integration_name = ?`,
			[project_id, 'SLACK'],
		);
	}
}
