import { BadRequestError } from "routing-controllers";
import { Service } from "typedi";
import { SlackOAuthResponse } from "./interface";
import fetch from "node-fetch";
@Service()
class SlackService {
	slackClientId: string;
	slackClientSecret: string;

	constructor() {
		if (!process.env.SLACK_CLIENT_ID || !process.env.SLACK_CLIENT_SECRET) {
			throw new Error("Slack client id and Slack client secret not set");
		}
		this.slackClientId = process.env.SLACK_CLIENT_ID;
		this.slackClientSecret = process.env.SLACK_CLIENT_SECRET;
	}

	private getSlackAccessConfig(code: string): Promise<SlackOAuthResponse> {
		const data = new URLSearchParams();
		data.append("code", code);
		data.append("client_id", this.slackClientId);
		data.append("client_secret", this.slackClientSecret);

		return fetch("https://slack.com/api/oauth.v2.access", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: data.toString(),
		}).then((res) => {
			return res.json();
		});
	}

	async verifySlackIntegrationRequest(code: string): Promise<SlackOAuthResponse> {
		const integrationConfig = await this.getSlackAccessConfig(code);
		if (!integrationConfig || integrationConfig.ok === false) {
			throw new BadRequestError("Not valid slack integration request");
		}

		return integrationConfig;
	}
}

export { SlackService };
