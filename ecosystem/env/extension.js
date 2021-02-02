const { IS_PRODUCTION, BACKEND_URL } = require('../config');

module.exports = {
	CRUSHER_EXTENSION_ENV: {
		NODE_ENV: IS_PRODUCTION ? "production" : "development",
		BACKEND_URL: BACKEND_URL
	}
};