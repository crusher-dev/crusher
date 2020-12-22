export const REDDIS = {
	host: process.env.REDIS_HOST ? process.env.REDIS_HOST : "redis",
	port: process.env.REDIS_PORT ? process.env.REDIS_PORT : 6379,
	password: process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : null,
};

export const MONGODB = {
	connection_string: process.env.MONGODB_CONNECTION_STRING ? process.env.MONGODB_CONNECTION_STRING : null,
	host: process.env.MONGODB_HOST ? process.env.MONGODB_HOST : "localhost",
	port: process.env.MONGODB_PORT ? process.env.MONGODB_PORT : 27017,
	// username: process.env.MONGODB_USERNAME ? process.env.MONGODB_USERNAME : 'remote',
	username: process.env.MONGODB_USERNAME ? process.env.MONGODB_USERNAME : "remote",
	password: process.env.MONGODB_PASSWORD ? process.env.MONGODB_PASSWORD : "password",
	database: process.env.MONGODB_DATABASE ? process.env.MONGODB_DATABASE : "crusher",
};
