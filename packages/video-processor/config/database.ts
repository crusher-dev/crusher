export const REDDIS = {
	connectionString: process.env.REDIS_CONNECTION_STRING,
	host: process.env.REDIS_HOST,
	port: parseInt(process.env.REDIS_PORT),
	password: process.env.REDIS_PASSWORD,
};
