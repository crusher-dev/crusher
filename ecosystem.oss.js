const { CRUSHER_APP_ENV, CRUSHER_SERVER_ENV, TEST_RUNNER_ENV, VIDEO_PROCESSOR_ENV } = require('./ecosystem/env');

module.exports = {
	apps: [
		{
			name: 'crusher-app',
			cwd: './packages/crusher-app',
			script: 'npm',
			args: 'run start',
			env: CRUSHER_APP_ENV,
			merge_logs: true,
			node_args: [
				"--max_old_space_size=100"
			]
		},
		{
			name: 'crusher-server',
			cwd: './packages/crusher-server',
			script: 'node',
			args: "app.js",
			env: { ...CRUSHER_SERVER_ENV, RUN_ALL_TOGETHER: "true" },
			merge_logs: true,
			node_args: [
				"--max_old_space_size=200"
			]
		},
		{
			name: 'test-runner',
			cwd: './packages/test-runner',
			script: 'node',
			args: "index.js",
			env: TEST_RUNNER_ENV,
		},
	],
};
