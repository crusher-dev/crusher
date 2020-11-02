export interface SlackOAuthResponse {
	ok: boolean;
	app_id: string;
	authed_user: object;
	scope: string;
	token_type: string;
	access_token: string;
	bot_user_id: string;
	team: {
		id: string;
		name: string;
	};
	enterprise?: string;
	incoming_webhook: {
		channel: string;
		channel_id: string;
		configuration_url: string;
		url: string;
	};
}
