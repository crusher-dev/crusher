// Centralize this config file
const { CRUSHER_APP_ENV, CRUSHER_SERVER_ENV, TEST_RUNNER_ENV, VIDEO_PROCESSOR_ENV } = require('./ecosystem/env');
const { IS_PRODUCTION } = require('./ecosystem/config');

console.log(`Starting pm2 for ${IS_PRODUCTION ? 'production' : 'development'}`);

const USE_OUTPUTS_DIR = process.env.USE_OUTPUTS_DIR;

module.exports = {
	apps: [
		{
			name: 'crusher-app',
			cwd: USE_OUTPUTS_DIR ? './output/crusher-app/' : './packages/crusher-app',
			script: IS_PRODUCTION ? 'node' : 'pnpm',
			args: IS_PRODUCTION ? 'server.js' : 'run dev',
			env: CRUSHER_APP_ENV,
			merge_logs: true,
		},
		{
			name: 'crusher-server',
			cwd: USE_OUTPUTS_DIR ? './output/crusher-server' : './packages/crusher-server',
			script: IS_PRODUCTION ? 'node' : 'pnpm',
			args: IS_PRODUCTION ? '-r source-map-support/register app.js' : 'run dev',
			env: CRUSHER_SERVER_ENV,
			merge_logs: true,
		},
		{
			name: 'crusher-server-cron',
			cwd: USE_OUTPUTS_DIR ? './output/crusher-server' : './packages/crusher-server',
			script: IS_PRODUCTION ? 'node' : 'pnpm',
			args: IS_PRODUCTION ? 'cron.js' : 'run dev:cron',
			env: CRUSHER_SERVER_ENV,
			merge_logs: true,
		},
		{
			merge_logs: true,
			name: 'crusher-server-queue',
			cwd: USE_OUTPUTS_DIR ? './output/crusher-server' : './packages/crusher-server',
			script: IS_PRODUCTION ? 'node' : 'pnpm',
			args: IS_PRODUCTION ? '-r source-map-support/register queue.js' : 'run dev:queue',
			env: CRUSHER_SERVER_ENV,
			merge_logs: true,
		},
		{
			name: 'test-runner',
			cwd: USE_OUTPUTS_DIR ? './output/test-runner' : './packages/test-runner',
			script: IS_PRODUCTION ? 'node' : 'pnpm',
			args: IS_PRODUCTION ? 'index.js' : 'run start',
			watch: ['src', 'config', 'util'],
			env: TEST_RUNNER_ENV,
		},
		{
			name: 'video-processor',
			cwd: USE_OUTPUTS_DIR ? './output/video-processor' : './packages/video-processor',
			script: IS_PRODUCTION ? 'node' : 'pnpm',
			args: IS_PRODUCTION ? 'index.js' : 'run start',
			env: VIDEO_PROCESSOR_ENV,
		},
		{
			name: 'local-storage',
			cwd: USE_OUTPUTS_DIR ? './output/crusher-server' : './packages/crusher-server',
			script: IS_PRODUCTION ? 'node' : 'pnpm',
			args: IS_PRODUCTION ? '-r source-map-support/register storage.js' : 'run dev:storage',
			watch: ['src', 'config'],
			env: CRUSHER_SERVER_ENV,
			merge_logs: true,
		},
	],
};
