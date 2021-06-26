const fs = require('fs');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

const OUTPUT_DIR = path.resolve(__dirname, '../../output/crusher-electron-app/');

fs.rmdirSync(OUTPUT_DIR, {force: true, recursive: true});

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
		filename: '[name].js',
		path: OUTPUT_DIR
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ]
	},
};

module.exports = [
	{
		...commonConfig,
		target: "electron-main",
		plugins: [
			new CopyPlugin({
				patterns: [{ from: path.resolve(__dirname, "../crusher-extension/build"), to: "extension/" }],
			}),
		],
		entry: {
			main: './src/main.ts'
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