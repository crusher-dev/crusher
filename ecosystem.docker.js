const { CRUSHER_APP_ENV, CRUSHER_SERVER_ENV, TEST_RUNNER_ENV, VIDEO_PROCESSOR_ENV } = require('./ecosystem/env');

module.exports = {
	apps: [
		{
			name: 'crusher-app',
			cwd: './output/crusher-app/',
			script: 'node',
			args: 'server.js',
			env: {
				...CRUSHER_APP_ENV,
				NEXT_PUBLIC_CRUSHER_MODE: "enterprise"
			},
			merge_logs: true,
			node_args: ['--max_old_space_size=100'],
		},
		{
			name: 'crusher-server',
			cwd: './output/crusher-server',
			script: 'node',
			args: '-r source-map-support/register app.js',
			env: { ...CRUSHER_SERVER_ENV, RUN_ALL_TOGETHER: 'true' },
			merge_logs: true,
			node_args: ['--max_old_space_size=200'],
		},
		{
			name: 'test-runner',
			cwd: './output/test-runner',
			script: 'node',
			args: '-r source-map-support/register index.js',
			env: TEST_RUNNER_ENV,
		},
		{
			name: 'video-processor',
			cwd: './output/video-processor',
			script: 'node',
			args: '-r source-map-support/register index.js',
			env: {
				...VIDEO_PROCESSOR_ENV,
				FFMPEG_PATH: require('@ffmpeg-installer/ffmpeg').path
			},
		},
	],
};
