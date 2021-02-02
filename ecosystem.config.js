// This is used by pm2
// Centralize this config file
const { CRUSHER_APP_ENV, CRUSHER_SERVER_ENV, TEST_RUNNER_ENV, VIDEO_PROCESSOR_ENV, CRUSHER_EXTENSION_ENV} = require('./ecosystem/env');
const { IS_PRODUCTION } = require('./ecosystem/config');

console.log(`Starting pm2 for ${IS_PRODUCTION ? "production" : "development"}`);

module.exports = {
	apps: [
		{
			name: 'crusher-app',
			cwd: './packages/crusher-app',
			script: 'npm',
			args: 'run dev',
			env: CRUSHER_APP_ENV,
			merge_logs: true
		},
		{
			name: 'crusher-server',
			cwd: './packages/crusher-server',
			script: 'npm',
			args: IS_PRODUCTION ? 'run build:start' : 'run dev',
			watch: ['src', 'config'],
			env: CRUSHER_SERVER_ENV,
			merge_logs: true,
		},
		{
			name: 'test-runner',
			cwd: './packages/test-runner',
			script: 'npm',
			args: 'run start',
			watch: ['src', 'config', 'util'],
			env: TEST_RUNNER_ENV
		},
		{
			name: 'video-processor',
			cwd: './packages/video-processor',
			script: 'npm',
			args: 'run start',
			env: VIDEO_PROCESSOR_ENV
		},
		{
			name: 'crusher-extension',
			cwd: './packages/crusher-extension',
			script: 'npm',
			args: 'run start',
			env: CRUSHER_EXTENSION_ENV,
		}
	]
}