import { BadRequestError } from "routing-controllers";
import { Service } from "typedi";
import { SlackOAuthResponse } from "./interface";
import fetch from "node-fetch";
@Service()
class SlackService {
	slackClientId: string;
	slackClientSecret: string;

	constructor() {
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

	async postMessage(blocks: Array<any>, channelId: string, botToken: string) {
		return fetch("https://slack.com/api/chat.postMessage", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${botToken}`,
			},
			body: JSON.stringify({
				channel: channelId,
				blocks: blocks,
			}),
		});
	}
}

export { SlackService };
