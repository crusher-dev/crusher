export const OCTOKIT_CONFIG = {
	appId: process.env.GITHUB_APP_ID,
	clientId: process.env.GITHUB_APP_CLIENT_ID,
	clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
	privateKey: process.env.GITHUB_APP_PRIVATE_KEY ? process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, "\n") : undefined,
};
