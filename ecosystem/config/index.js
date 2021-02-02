const { GOOGLE_CONFIG } = require('./google');
const { THIRD_PARTY_API_KEYS } = require('./thirdParty');
const { SLACK_CONFIG } = require('./slack');
const { REDIS_CONFIG } = require('./redis');
const { MYSQL_DB_CONFIG } = require('./mysql');
const { MONGODB_CONFIG } = require('./mongodb');
const { GITHUB_CONFIG } = require('./github');
const { AWS_CONFIG } = require('./aws');

const IS_PRODUCTION = process.env.CRUSHER_ENV === "production";
const BACKEND_URL = process.env.BACKEND_URL ? process.env.BACKEND_URL : 'http://localhost:8000/';
const FRONTEND_URL = process.env.FRONTEND_URL ? process.env.FRONTEND_URL : 'http://localhost:3000/';

module.exports = {
	IS_PRODUCTION,
	BACKEND_URL,
	FRONTEND_URL,
	AWS_CONFIG,
	GITHUB_CONFIG,
	MONGODB_CONFIG,
	MYSQL_DB_CONFIG,
	REDIS_CONFIG,
	SLACK_CONFIG,
	THIRD_PARTY_API_KEYS,
	GOOGLE_CONFIG
};
