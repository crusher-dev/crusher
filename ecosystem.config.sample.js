// Centralize this config file
const { CRUSHER_APP_ENV, CRUSHER_SERVER_ENV, TEST_RUNNER_ENV, VIDEO_PROCESSOR_ENV, CRUSHER_EXTENSION_ENV } = require('./ecosystem/env');
const { IS_PRODUCTION } = require('./ecosystem/config');

console.log(`Starting pm2 for ${IS_PRODUCTION ? 'production' : 'development'}`);

module.exports = {
	apps: [
		{
			name: 'crusher-app',
			cwd: './packages/crusher-app',
			script: IS_PRODUCTION ? 'node' : "npm",
			args: IS_PRODUCTION ? 'server.js' : 'run dev',
			env: CRUSHER_APP_ENV,
			merge_logs: true,
		},
		{
			name: 'crusher-server',
			cwd: './packages/crusher-server',
			script: IS_PRODUCTION ? 'node' : 'npm',
			args: IS_PRODUCTION ? '-r source-map-support/register app.js' : 'run dev',
			watch: ['src', 'config'],
			env: CRUSHER_SERVER_ENV,
			merge_logs: true,
		},
		{
			name: 'crusher-server-cron',
			cwd: './packages/crusher-server',
			script: IS_PRODUCTION ? 'node' : 'npm',
			args: IS_PRODUCTION ? 'cron.js' : 'run dev:cron',
			watch: ['src', 'config'],
			env: CRUSHER_SERVER_ENV,
			merge_logs: true,
		},
		{
			merge_logs: true,
			name: 'crusher-server-queue',
			cwd: './packages/crusher-server',
			script: IS_PRODUCTION ? 'node' : 'npm',
			args: IS_PRODUCTION ? '-r source-map-support/register queue.js' : 'run dev:queue',
			watch: ['src', 'config'],
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
			script: IS_PRODUCTION ? 'node' : 'npm',
			args: IS_PRODUCTION ? 'index.js' : 'run start',
			env: VIDEO_PROCESSOR_ENV,
		},
		{
			name: 'local-storage',
			cwd: './packages/crusher-server',
			script: IS_PRODUCTION ? 'node' : 'npm',
			args: IS_PRODUCTION ? '-r source-map-support/register storage.js' : 'run dev:storage',
			watch: ['src', 'config'],
			env: CRUSHER_SERVER_ENV,
			merge_logs: true,
		},
	],
};