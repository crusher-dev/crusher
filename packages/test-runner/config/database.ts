export const REDDIS = {
	host: process.env.REDIS_HOST ,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD,
};

export const getMongoDBConnectionString = () : string => {
	if(process.env.MONGODB_CONNECTION_STRING){
		return process.env.MONGODB_CONNECTION_STRING;
	}
	const host = process.env.MONGODB_HOST;
	const port = process.env.MONGODB_PORT;
	const username = process.env.MONGODB_USERNAME;
	const password = process.env.MONGODB_PASSWORD;
	const database = process.env.MONGODB_DATABASE;

	return `mongodb://${username}:${password}@${host}:${port}/${database}`
};
