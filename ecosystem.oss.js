const { CRUSHER_APP_ENV, CRUSHER_SERVER_ENV, TEST_RUNNER_ENV, VIDEO_PROCESSOR_ENV } = require('./ecosystem/env');

module.exports = {
	apps: [
		{
			name: 'crusher-app',
			cwd: './packages/crusher-app',
			script: 'node',
			args: 'server.js',
			env: CRUSHER_APP_ENV,
			merge_logs: true,
		},
		{
			name: 'crusher-server',
			cwd: './packages/crusher-server',
			script: 'node',
			args: "dist/app.js",
			watch: [],
			env: CRUSHER_SERVER_ENV,
			merge_logs: true,
		},
		{
			name: 'crusher-server-cron',
			cwd: './packages/crusher-server',
			script: 'node',
			args: "dist/cron.js",
			watch: [],
			env: CRUSHER_SERVER_ENV,
			merge_logs: true,
		},
		{
			name: 'crusher-server-queue',
			cwd: './packages/crusher-server',
			script: 'node',
			args: "dist/queue.js",
			watch: [],
			env: CRUSHER_SERVER_ENV,
			merge_logs: true,
		},
		{
			name: 'test-runner',
			cwd: './packages/test-runner',
			script: 'node',
			args: "dist/index.js",
			env: TEST_RUNNER_ENV,
			watch: [],
		},
		{
			name: 'video-processor',
			cwd: './packages/video-processor',
			script: 'node',
			args: "dist/index.js",
			env: VIDEO_PROCESSOR_ENV,
			watch: [],
		},
	],
};
