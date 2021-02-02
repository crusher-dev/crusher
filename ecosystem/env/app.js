const { IS_PRODUCTION, GITHUB_CONFIG, FRONTEND_URL, BACKEND_URL } = require('../config');

module.exports = {
	CRUSHER_APP_ENV: {
		NODE_ENV: IS_PRODUCTION ? "production" : "development",
		NEXT_PUBLIC_BACKEND_URL: BACKEND_URL,
		NEXT_PUBLIC_IS_DEVELOPMENT: true,
		NEXT_PUBLIC_FRONTEND_URL: FRONTEND_URL,
		/* Github API Config */
		NEXT_PUBLIC_GITHUB_APP_CLIENT_ID: GITHUB_CONFIG.APP_CLIENT_ID,
		NEXT_PUBLIC_GITHUB_APP_CLIENT_SECRET: GITHUB_CONFIG.APP_CLIENT_SECRET,
		NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID: GITHUB_CONFIG.OAUTH_CLIENT_ID,
		NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_SECRET: GITHUB_CONFIG.OAUTH_CLIENT_SECRET,
	}
};