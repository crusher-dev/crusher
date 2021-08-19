export const REDIS = {
	connectionString: process.env.REDIS_CONNECTION_STRING,
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : null,
	password: process.env.REDIS_PASSWORD,
};
