//webpack.config.js
const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	mode: "development",
	devtool: "inline-source-map",
	target: "node",
	entry: {
		index: "./index.ts",
	},
	output: {
		libraryTarget: "commonjs",
		path: path.resolve(__dirname, "./build"),
		filename: "[name].js", // <--- Will be compiled to this single file
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.FLUENTFFMPEG_COV": false,
		}),
		new CopyPlugin({
			patterns: [{ from: `${path.dirname(require.resolve("bullmq"))}/commands/`, to: "commands/", globOptions: { ignore: ["**/*.js", "**/*.ts"] } }],
		}),
	],
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
			},
			{
				test: /node_modules\/bullmq\/dist\/commands\/index\.js$/,
				use: {
					loader: "string-replace-loader",
					options: {
						search: "__dirname",
						replace: `"./commands"`,
					},
				},
			},
		],
	},
};
