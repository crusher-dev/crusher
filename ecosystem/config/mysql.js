const MYSQL_DB_CONFIG = {
	HOST: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
	USERNAME: process.env.DB_USERNAME ? process.env.DB_USERNAME : 'root',
	PASSWORD: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'password',
	PORT: process.env.DB_PORT ? process.env.DB_PORT : 3306,
};

module.exports = {
	MYSQL_DB_CONFIG
};
