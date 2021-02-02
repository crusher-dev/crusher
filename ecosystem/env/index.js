const {CRUSHER_APP_ENV} = require('./app');
const {CRUSHER_SERVER_ENV} = require('./server');
const {TEST_RUNNER_ENV} = require('./testRunner');
const {VIDEO_PROCESSOR_ENV} = require('./videoProcessor');
const {CRUSHER_EXTENSION_ENV} = require('./extension');

module.exports = {
	CRUSHER_APP_ENV,
	CRUSHER_SERVER_ENV,
	TEST_RUNNER_ENV,
	VIDEO_PROCESSOR_ENV,
	CRUSHER_EXTENSION_ENV
};
