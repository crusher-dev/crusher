// This is used by pm2
// Centralize this config file
// const { CRUSHER_APP_ENV, CRUSHER_SERVER_ENV, TEST_RUNNER_ENV, VIDEO_PROCESSOR_ENV, CRUSHER_EXTENSION_ENV } = require('./ecosystem/env');
// const { IS_PRODUCTION } = require('./ecosystem/config');
//
// console.log(`Starting pm2 for ${IS_PRODUCTION ? 'production' : 'development'}`);

module.exports = {
	apps: [
		{
			name: 'crusher-app',
			cwd: './packages/crusher-app',
			script: 'node',
			args: 'server.js',
			merge_logs: true,
		},
		{
			name: 'crusher-server',
			cwd: './packages/crusher-server',
			script: 'node',
			args: "dist/app.js",
			watch: [],
			merge_logs: true,
		},
		{
			name: 'crusher-server-cron',
			cwd: './packages/crusher-server',
			script: 'node',
			args: "dist/cron.js",
			watch: [],
			merge_logs: true,
		},
		{
			name: 'crusher-server-queue',
			cwd: './packages/crusher-server',
			script: 'node',
			args: "dist/queue.js",
			watch: [],
			merge_logs: true,
		},
		{
			name: 'test-runner',
			cwd: './packages/test-runner',
			script: 'node',
			args: "dist/index.js",
			watch: [],
		},
		{
			name: 'video-processor',
			cwd: './packages/video-processor',
			script: 'node',
			args: "dist/index.js",
			watch: [],
		},
	],
};
