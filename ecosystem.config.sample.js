// This is used by pm2
// Centralize this config file

const MYSQL_DB_CONFIG = {
	HOST: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
	USERNAME: process.env.DB_USERNAME ? process.env.DB_USERNAME : 'root',
	PASSWORD: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'password',
	PORT: process.env.DB_PORT ? process.env.DB_PORT : 3306,
};

const MONGODB_CONFIG = {
	CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING ? process.env.MONGODB_CONNECTION_STRING : null,
	HOST: process.env.MOGNODB_HOST ? process.env.MONGODB_HOST : 'localhost',
	PORT: process.env.MONGODB_PORT ? process.env.MONGODB_PORT : '27017',
	USERNAME: process.env.MONGODB_USERNAME ? process.env.MONGODB_USERNAME : 'admin',
	PASSWORD: process.env.MONGODB_PASSWORD ? process.env.MONGODB_PASSWORD : '',
	DATABASE: process.env.MONGODB_DATABASE ? process.env.MONGODB_DATABASE : '',
};

const REDIS_CONFIG = {
	CONNECTION_STRING: process.env.REDIS_CONNECTION_STRING ? process.env.REDIS_CONNECTION_STRING : null,
	HOST: process.env.REDIS_HOST ? process.env.REDIS_HOST : 'localhost',
	PORT: process.env.REDIS_PORT ? process.env.REDIS_PORT : 6379,
	PASSWORD: process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : '',
};

const GOOGLE_CONFIG = {
	CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID : '428880114376-i3jmef0t11n8c3otiqe5rnhtsfq6ldlk.apps.googleusercontent.com',
	CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? process.env.GOOGLE_CLIENT_SECRET : 'nCNWW2RAGDRzubb7RpjgZOBY',
};

const SLACK_CONFIG = {
	CLIENT_ID: process.env.SLACK_CLIENT_ID ? process.env.SLACK_CLIENT_ID : '650512229650.1194885099766',
	CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET ? process.env.SLACK_CLIENT_SECRET : 'c8b73831d4fd48fba5be4f5c4515d6a8',
};

const GITHUB_CONFIG = {
	CLIENT_ID: process.env.GITHUB_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID : 'Iv1.b94bab70cd7aad37',
};

const THIRD_PARTY_API_KEYS = {
	SENDGRID: process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY : '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',
	LOGDNA: process.env.LOGDNA_API_KEY ? process.env.LOGDNA_API_KEY : 'c7bdd500e3cfbfe457a2ec4168b8cfaa',
	STRIPE: process.env.STRIPE_API_KEY
		? process.env.STRIPE_API_KEY
		: 'sk_test_51GpPlSJrl7auivTJtYVJyvBH1lsPnYHousGgR37uZvGo7EktiTRCAqZPlf0dicwkNEjRuXHYCzy6c5WMmX3x14rb00RWsMT0hy',
};

const AWS_CONFIG = {
	AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID : 'AKIAIEQN54PTYHMYGXVA',
	AWS_S3_REGION: process.env.AWS_S3_REGION ? process.env.AWS_S3_REGION : 'us-east-1',
	AWS_S3_VIDEO_BUCKET: process.env.AWS_S3_VIDEO_BUCKET ? process.env.AWS_S3_VIDEO_BUCKET : 'crusher-videos',
	AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? process.env.AWS_SECRET_ACCESS_KEY : 'p77qG8tt8Pkm4a8eFUtOx5I5IzDzQCsoReX1pJOe',
};

const BACKEND_URL = process.env.BACKEND_URL ? process.env.BACKEND_URL : 'http://localhost:8000/';
const FRONTEND_URL = process.env.FRONTEND_URL ? process.env.FRONTEND_URL : 'http://localhost:3000/';

module.exports = {
	apps: [
		{
			name: 'crusher-app',
			cwd: './packages/crusher-app',
			script: 'npm',
			args: 'run dev',
			env: {
				BACKEND_URL: BACKEND_URL,
				IS_DEVELOPMENT: true,
				FRONTEND_URL: FRONTEND_URL,
			},
			merge_logs: true,
			out_file: './logs/crusher-app.out',
			log_file: './logs/crusher-app.log.out',
			error_file: './logs/crusher-app.error.out',
		},
		{
			name: 'crusher-server',
			cwd: './packages/crusher-server',
			script: 'npm',
			args: 'run build:start',
			watch: ['src', 'config'],
			env: {
				PORT: 8000,
				BACKEND_URL: BACKEND_URL,
				FRONTEND_URL: FRONTEND_URL,
				/* Server SQL DB Config */
				DB_TYPE: 'mysql',
				DB_CONNECTION_POOL: 10,
				DB_HOST: MYSQL_DB_CONFIG.HOST,
				DB_PORT: MYSQL_DB_CONFIG.PORT,
				DB_USERNAME: MYSQL_DB_CONFIG.USERNAME,
				DB_PASSWORD: MYSQL_DB_CONFIG.PASSWORD,
				DB_DATABASE: 'crusher',
				/* Server Redis DB config */
				REDIS_CONNECTION_STRING: REDIS_CONFIG.CONNECTION_STRING ? REDIS_CONFIG.CONNECTION_STRING : null,
				REDIS_HOST: REDIS_CONFIG.HOST,
				REDIS_PORT: REDIS_CONFIG.PORT,
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
				GITHUB_CLIENT_ID: GITHUB_CONFIG.CLIENT_ID,
				LOGDNA_API_KEY: THIRD_PARTY_API_KEYS.LOGDNA,
				/* Stripe API Config */
				STRIPE_SECRET_API_KEY: THIRD_PARTY_API_KEYS.STRIPE,
			},
			merge_logs: true,
			out_file: './logs/crusher-server.out',
			log_file: './logs/crusher-server.log.out',
			error_file: './logs/crusher-server.error.out',
		},
		{
			name: 'test-runner',
			cwd: './packages/test-runner',
			script: 'npm',
			args: 'run start:prod',
			watch: ['src', 'config', 'util'],
			env: {
				/* Runner MongoDB config */
				MONGODB_CONNECTION_STRING: MONGODB_CONFIG.CONNECTION_STRING ? MONGODB_CONFIG.CONNECTION_STRING : null,
				MONGODB_HOST: MONGODB_CONFIG.HOST,
				MONGODB_PORT: MONGODB_CONFIG.PORT,
				MONGODB_USERNAME: MONGODB_CONFIG.USERNAME,
				MONGODB_PASSWORD: MONGODB_CONFIG.PASSWORD,
				MONGODB_DATABASE: MONGODB_CONFIG.DATABASE,
				/* LogDNA API config */
				LOGDNA_API_KEY: THIRD_PARTY_API_KEYS.LOGDNA,
				/* Runner Redis DB Config */
				REDIS_CONNECTION_STRING: REDIS_CONFIG.CONNECTION_STRING ? REDIS_CONFIG.CONNECTION_STRING : null,
				REDIS_HOST: REDIS_CONFIG.HOST,
				REDIS_PORT: REDIS_CONFIG.PORT,
				REDIS_PASSWORD: REDIS_CONFIG.PASSWORD,
				AWS_ACCESS_KEY_ID: AWS_CONFIG.AWS_ACCESS_KEY_ID,
				AWS_S3_REGION: AWS_CONFIG.AWS_S3_REGION,
				AWS_S3_VIDEO_BUCKET: AWS_CONFIG.AWS_S3_VIDEO_BUCKET,
				AWS_SECRET_ACCESS_KEY: AWS_CONFIG.AWS_SECRET_ACCESS_KEY,
			},
		},
		{
			name: 'crusher-extension',
			cwd: './packages/crusher-extension',
			script: 'npm',
			args: 'run dev',
			env: {
				BACKEND_URL: BACKEND_URL,
			},
		},
		{
			name: 'video-processor',
			cwd: './packages/video-processor',
			script: 'npm',
			args: 'run start',
			env: {
				/* Video Processor MongoDB config */
				MONGODB_CONNECTION_STRING: MONGODB_CONFIG.CONNECTION_STRING ? MONGODB_CONFIG.CONNECTION_STRING : null,
				MONGODB_HOST: MONGODB_CONFIG.HOST,
				MONGODB_PORT: MONGODB_CONFIG.PORT,
				MONGODB_USERNAME: MONGODB_CONFIG.USERNAME,
				MONGODB_PASSWORD: MONGODB_CONFIG.PASSWORD,
				MONGODB_DATABASE: MONGODB_CONFIG.DATABASE,
				/* Redis DB config */
				REDIS_CONNECTION_STRING: REDIS_CONFIG.CONNECTION_STRING ? REDIS_CONFIG.CONNECTION_STRING : null,
				REDIS_HOST: REDIS_CONFIG.HOST,
				REDIS_PORT: REDIS_CONFIG.PORT,
				REDIS_PASSWORD: REDIS_CONFIG.PASSWORD,
				/* LogDNA config */
				LOGDNA_API_KEY: THIRD_PARTY_API_KEYS.LOGDNA,
				/* AWS config */
				AWS_ACCESS_KEY_ID: AWS_CONFIG.AWS_ACCESS_KEY_ID,
				AWS_S3_REGION: AWS_CONFIG.AWS_S3_REGION,
				AWS_S3_VIDEO_BUCKET: AWS_CONFIG.AWS_S3_VIDEO_BUCKET,
				AWS_SECRET_ACCESS_KEY: AWS_CONFIG.AWS_SECRET_ACCESS_KEY,
			},
		},
	],
};
