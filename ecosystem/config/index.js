const config = {
	IS_PRODUCTION: false,
	IS_OPEN_SOURCE: false,
	BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000/server',
	INTERNAL_BACKEND_URL: process.env.INTERNAL_BACKEND_URL ||'http://localhost:3000/server',
	FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000/',
	AWS_CONFIG: {
		AWS_ACCESS_KEY_ID:  process.env.AWS_ACCESS_KEY_ID || 'AKIAIEQN54PTYHMYGXVA',
		AWS_S3_REGION:process.env.AWS_S3_REGION || 'us-east-1',
		AWS_S3_VIDEO_BUCKET: process.env.AWS_S3_VIDEO_BUCKET || 'crusher-videos',
		AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || 'p77qG8tt8Pkm4a8eFUtOx5I5IzDzQCsoReX1pJOe',
	},
	GITHUB_CONFIG: {
		APP_CLIENT_ID:  process.env.GITHUB_APP_CLIENT_ID  || 'Iv1.b94bab70cd7aad37',
		APP_CLIENT_SECRET: process.env.GITHUB_APP_CLIENT_SECRET || '7bf210e8fc74a8382ceb96132989e34e7cd573ea',
		OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID || 'fefa5526be8607ab2521',
		OAUTH_CLIENT_SECRET:  process.env.GITHUB_OAUTH_CLIENT_SECRET|| 'b7584cc0d1bf1484ec1f97493ce8d4e8f205f087',
	},
	MONGODB_CONFIG: {
		CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING|| "mongodb://localhost:27017/crusher",
		HOST: process.env.MONGODB_HOST|| 'localhost',
		PORT: process.env.MONGODB_PORT || '27017',
		USERNAME:  process.env.MONGODB_USERNAME || 'admin',
		PASSWORD: process.env.MONGODB_PASSWORD ||'',
		DATABASE: process.env.MONGODB_DATABASE || 'crusher',
	},
	MYSQL_DB_CONFIG: {
		HOST: process.env.DB_HOST || 'localhost',
		USERNAME: process.env.DB_USERNAME ||'remote',
		PASSWORD: process.env.DB_PASSWORD ||'password',
		PORT: process.env.DB_PORT ||3306,
	},
	REDIS_CONFIG: {
		CONNECTION_STRING: process.env.REDIS_CONNECTION_STRING || null,
		HOST: process.env.REDIS_HOST ||'localhost',
		PORT: process.env.REDIS_PORT || 6379,
		PASSWORD:  process.env.REDIS_PASSWORD || '',
	},
	SLACK_CONFIG: {
		CLIENT_ID:  process.env.SLACK_CLIENT_ID || '650512229650.1194885099766',
		CLIENT_SECRET:  process.env.SLACK_CLIENT_SECRET || 'c8b73831d4fd48fba5be4f5c4515d6a8',
	},
	THIRD_PARTY_API_KEYS: {
		SENDGRID:  process.env.SENDGRID_API_KEY || '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',
		LOGDNA:  process.env.LOGDNA_API_KEY ||'c7bdd500e3cfbfe457a2ec4168b8cfaa',
		STRIPE:
			process.env.STRIPE_API_KEY
			||'sk_test_51GpPlSJrl7auivTJtYVJyvBH1lsPnYHousGgR37uZvGo7EktiTRCAqZPlf0dicwkNEjRuXHYCzy6c5WMmX3x14rb00RWsMT0hy',
	},
	GOOGLE_CONFIG: {
		CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '428880114376-i3jmef0t11n8c3otiqe5rnhtsfq6ldlk.apps.googleusercontent.com',
		CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET||
			'nCNWW2RAGDRzubb7RpjgZOBY',
	}
}


module.exports = config;
