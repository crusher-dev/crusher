const REDIS_CONFIG = {
	CONNECTION_STRING: process.env.REDIS_CONNECTION_STRING ? process.env.REDIS_CONNECTION_STRING : null,
	HOST: process.env.REDIS_HOST ? process.env.REDIS_HOST : 'localhost',
	PORT: process.env.REDIS_PORT ? process.env.REDIS_PORT : 6379,
	PASSWORD: process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : '',
};

module.exports = {
	REDIS_CONFIG
};
