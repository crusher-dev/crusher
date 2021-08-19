const path = require('path');
const url = require('url');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const IS_HEROKU = process.env.IS_HEROKU;

module.exports = {
	IS_PRODUCTION: process.env.CRUSHER_ENV === 'production',
	BACKEND_URL: process.env.STANDALONE_APP_URL ? url.resolve(process.env.STANDALONE_APP_URL, '/server/') : process.env.BACKEND_URL,
	FRONTEND_URL: process.env.STANDALONE_APP_URL ? process.env.STANDALONE_APP_URL : process.env.FRONTEND_URL,
	AWS_CONFIG: {
		AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
		AWS_S3_REGION: process.env.AWS_S3_REGION,
		AWS_S3_VIDEO_BUCKET: process.env.AWS_S3_VIDEO_BUCKET,
		AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
	},
	GITHUB_CONFIG: {
		APP_CLIENT_ID: process.env.GITHUB_APP_CLIENT_ID,
		APP_CLIENT_SECRET: process.env.GITHUB_APP_CLIENT_SECRET,
		OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID,
		OAUTH_CLIENT_SECRET: process.env.GITHUB_OAUTH_CLIENT_SECRET,
	},
	MONGODB_CONFIG: {
		CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,
		HOST: process.env.MONGODB_HOST,
		PORT: parseInt(process.env.MONGODB_PORT, 10) || 27017,
		USERNAME: process.env.MONGODB_USERNAME,
		PASSWORD: process.env.MONGODB_PASSWORD,
		DATABASE: process.env.MONGODB_DATABASE,
	},
	MYSQL_DB_CONFIG: {
		CONNECTION_STRING: IS_HEROKU ? process.env.CLEARDB_DATABASE_URL : process.env.DB_CONNECTION_STRING,
		HOST: process.env.DB_HOST,
		USERNAME: process.env.DB_USERNAME,
		PASSWORD: process.env.DB_PASSWORD,
		DATABASE: process.env.DB_DATABASE || 'crusher',
		PORT: parseInt(process.env.DB_PORT, 10) || 3306,
	},
	REDIS_CONFIG: {
		CONNECTION_STRING: IS_HEROKU ? process.env.REDIS_URL : process.env.REDIS_CONNECTION_STRING,
		HOST: process.env.REDIS_HOST,
		PORT: parseInt(process.env.REDIS_PORT, 10),
		PASSWORD: process.env.REDIS_PASSWORD,
	},
	SLACK_CONFIG: {
		CLIENT_ID: process.env.SLACK_CLIENT_ID,
		CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
	},
	THIRD_PARTY_API_KEYS: {
		SENDGRID: process.env.SENDGRID_API_KEY,
		LOGDNA: process.env.LOGDNA_API_KEY,
		STRIPE: process.env.STRIPE_API_KEY,
	},
	GOOGLE_CONFIG: {
		CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	},
};
