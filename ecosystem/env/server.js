const {
	IS_PRODUCTION,
	THIRD_PARTY_API_KEYS,
	SLACK_CONFIG,
	GOOGLE_CONFIG,
	MONGODB_CONFIG,
	REDIS_CONFIG,
	MYSQL_DB_CONFIG,
	GITHUB_CONFIG,
	AWS_CONFIG,
	FRONTEND_URL,
	BACKEND_URL,
} = require('../config');

module.exports = {
	CRUSHER_SERVER_ENV: {
		NODE_ENV: IS_PRODUCTION ? 'production' : 'development',
		PORT: 8000,
		BACKEND_URL: BACKEND_URL,
		FRONTEND_URL: FRONTEND_URL,
		/* Server SQL DB Config */
		DB_CONNECTION_STRING: MYSQL_DB_CONFIG.CONNECTION_STRING,
		DB_TYPE: 'mysql',
		DB_CONNECTION_POOL: 10,
		DB_HOST: MYSQL_DB_CONFIG.HOST,
		DB_PORT: MYSQL_DB_CONFIG.PORT,
		DB_USERNAME: MYSQL_DB_CONFIG.USERNAME,
		DB_PASSWORD: MYSQL_DB_CONFIG.PASSWORD,
		DB_DATABASE: MYSQL_DB_CONFIG.DATABASE,
		/* Server Redis DB config */
		REDIS_CONNECTION_STRING: REDIS_CONFIG.CONNECTION_STRING ? REDIS_CONFIG.CONNECTION_STRING : null,
		REDIS_HOST: REDIS_CONFIG.HOST,
		REDIS_PORT: REDIS_CONFIG.PORT,
		REDIS_USER: REDIS_CONFIG.USERNAME,
		REDIS_PASSWORD: REDIS_CONFIG.PASSWORD,
		/* Server MongoDB config */
		MONGODB_CONNECTION_STRING: MONGODB_CONFIG.CONNECTION_STRING ? MONGODB_CONFIG.CONNECTION_STRING : null,
		MONGODB_HOST: MONGODB_CONFIG.HOST,
		MONGODB_PORT: MONGODB_CONFIG.PORT,
		MONGODB_USERNAME: MONGODB_CONFIG.USERNAME,
		MONGODB_PASSWORD: MONGODB_CONFIG.PASSWORD,
		MONGODB_DATABASE: MONGODB_CONFIG.DATABASE,
		/* Server Google client config */
		GOOGLE_CLIENT_ID: GOOGLE_CONFIG.CLIENT_ID,
		GOOGLE_CLIENT_SECRET: GOOGLE_CONFIG.CLIENT_SECRET,
		/* Slack API config */
		SLACK_CLIENT_ID: SLACK_CONFIG.CLIENT_ID,
		SLACK_CLIENT_SECRET: SLACK_CONFIG.CLIENT_SECRET,
		/* Sendgrid API Config */
		SENDGRID_API_KEY: THIRD_PARTY_API_KEYS.SENDGRID,
		/* Github API Config */
		GITHUB_APP_CLIENT_ID: GITHUB_CONFIG.APP_CLIENT_ID,
		GITHUB_APP_CLIENT_SECRET: GITHUB_CONFIG.APP_CLIENT_SECRET,
		GITHUB_APP_PRIVATE_KEY: GITHUB_CONFIG.APP_PRIVATE_KEY,
		GITHUB_APP_ID: GITHUB_CONFIG.APP_ID,
		/* LogDNA API Config */
		LOGDNA_API_KEY: THIRD_PARTY_API_KEYS.LOGDNA,
		/* Stripe API Config */
		STRIPE_SECRET_API_KEY: THIRD_PARTY_API_KEYS.STRIPE,
		/* AWS S3 Config */
		AWS_ACCESS_KEY_ID: AWS_CONFIG.AWS_ACCESS_KEY_ID,
		AWS_S3_REGION: AWS_CONFIG.AWS_S3_REGION,
		AWS_S3_VIDEO_BUCKET: AWS_CONFIG.AWS_S3_VIDEO_BUCKET,
		AWS_SECRET_ACCESS_KEY: AWS_CONFIG.AWS_SECRET_ACCESS_KEY,
	},
};
