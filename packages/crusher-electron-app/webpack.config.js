const path = require('path');

const commonConfig = {
	mode: process.env.NODE_ENV || 'development',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader"
			}
		]
	},
	output: {
		filename: '[name]-bundle.js',
		path: path.resolve(__dirname, '../../output/crusher-electron-app/')
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ]
	},
};

module.exports = [
	{
		...commonConfig,
		target: "electron-main",
		entry: {
			main: './src/main/index.ts'
		}
	},
	{
		...commonConfig,
		target: "electron-preload",
		entry: {
			preload: './src/preload.ts'
		}
	}
]