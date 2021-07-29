export const REDIS = {
	connectionString: process.env.REDIS_CONNECTION_STRING,
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : null,
	password: process.env.REDIS_PASSWORD,
};

export const getMongoDBConnectionString = (): string => {
	if (process.env.MONGODB_CONNECTION_STRING && process.env.MONGODB_CONNECTION_STRING !== "null") {
		return process.env.MONGODB_CONNECTION_STRING;
	}
	const host = process.env.MONGODB_HOST;
	const port = process.env.MONGODB_PORT;
	const username = process.env.MONGODB_USERNAME;
	const password = process.env.MONGODB_PASSWORD;
	const database = process.env.MONGODB_DATABASE;

	return `mongodb://${username}${password ? `:${password}` : ""}@${host}:${port}/${database}`;
};
