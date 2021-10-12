// This is used by pm2
// Centralize this config file
const { CRUSHER_APP_ENV, CRUSHER_SERVER_ENV, TEST_RUNNER_ENV, VIDEO_PROCESSOR_ENV, CRUSHER_EXTENSION_ENV } = require('./ecosystem/env');
const { IS_PRODUCTION } = require('./ecosystem/config');

console.log(`Starting pm2 for ${IS_PRODUCTION ? 'production' : 'development'}`);

module.exports = {
	apps: [
		{
			name: 'crusher-app',
			cwd: './packages/crusher-app',
			script: 'npm',
			args: 'start',
			env: CRUSHER_APP_ENV,
			merge_logs: true,
		},
		{
			name: 'crusher-server',
			cwd: './packages/crusher-server',
			script: 'node',
			args: '-r source-map-support/register app.js',
			env: CRUSHER_SERVER_ENV,
			merge_logs: true,
		},
		{
			name: 'crusher-server-queue',
			cwd: './packages/crusher-server',
			script: 'node',
			args: 'queue.js',
			env: CRUSHER_SERVER_ENV,
			merge_logs: true,
		},
		{
			name: 'test-runner',
			cwd: './packages/test-runner',
			script: IS_PRODUCTION ? 'node' : 'npm',
			args: IS_PRODUCTION ? 'index.js' : 'run start',
			watch: ['src', 'config', 'util'],
			env: TEST_RUNNER_ENV,
		},
		{
			name: 'video-processor',
			cwd: './packages/video-processor',
			script: 'npm',
			args: 'run start',
			env: VIDEO_PROCESSOR_ENV,
		},
	],
};
