//webpack.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: "development",
	devtool: "inline-source-map",
	target: "node",
	entry: {
		index: "./src/app.ts",
	},
	output: {
		libraryTarget: 'commonjs',
		path: path.resolve(__dirname, './build'),
		filename: "[name].js" // <--- Will be compiled to this single file
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.FLUENTFFMPEG_COV': false
		})
	],
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	externals: {
		bullmq: "bullmq"
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
