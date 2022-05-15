const { CRUSHER_APP_ENV, CRUSHER_SERVER_ENV, TEST_RUNNER_ENV, VIDEO_PROCESSOR_ENV } = require('./ecosystem/env');

module.exports = {
	apps: [
		{
			name: 'crusher-app',
			cwd: './packages/crusher-app/',
			script: 'server.js',
			exec_mode: 'cluster',
			env: {
				...CRUSHER_APP_ENV,
				NEXT_PUBLIC_CRUSHER_MODE: 'enterprise',
			},
			merge_logs: true,
			node_args: ['--max_old_space_size=100'],
		},
		{
			name: 'crusher-server',
			cwd: './packages/crusher-server',
			script: 'app.js',
			exec_mode: 'cluster',
			env: { ...CRUSHER_SERVER_ENV, RUN_ALL_TOGETHER: 'true' },
			merge_logs: true,
			node_args: ['--max_old_space_size=200'],
		},
		{
			merge_logs: true,
			name: 'crusher-server-queue',
			cwd: './packages/crusher-server',
			script: 'queue.js',
			exec_mode: 'cluster',
			env: CRUSHER_SERVER_ENV,
			merge_logs: true,
		},
		{
			name: 'test-runner',
			cwd: './packages/test-runner',
			exec_mode: 'cluster',
			script: 'index.js',
			env: {...TEST_RUNNER_ENV, PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH},
		},
		{
			name: 'video-processor',
			cwd: './packages/video-processor',
			exec_mode: 'cluster',
			script: 'index.js',
			env: {
				...VIDEO_PROCESSOR_ENV,
				FFMPEG_PATH: require('@ffmpeg-installer/ffmpeg').path,
			},
		},
	],
};