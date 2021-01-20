//webpack.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	target: "node",
	entry: {
		index: "./src/app.ts",
	},
	output: {
		libraryTarget: 'umd',
		filename: "app.js",
		globalObject: 'this'
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader"
			}
		]
	}
};
