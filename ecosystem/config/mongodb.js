const MONGODB_CONFIG = {
	CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING ? process.env.MONGODB_CONNECTION_STRING : null,
	HOST: process.env.MOGNODB_HOST ? process.env.MONGODB_HOST : 'localhost',
	PORT: process.env.MONGODB_PORT ? process.env.MONGODB_PORT : '27017',
	USERNAME: process.env.MONGODB_USERNAME ? process.env.MONGODB_USERNAME : 'admin',
	PASSWORD: process.env.MONGODB_PASSWORD ? process.env.MONGODB_PASSWORD : '',
	DATABASE: process.env.MONGODB_DATABASE ? process.env.MONGODB_DATABASE : '',
};

module.exports = {
	MONGODB_CONFIG
};
