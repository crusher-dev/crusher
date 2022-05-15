const path = require("path");
const glob = require("glob");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
	mode: "production",
	devtool: "source-map",
	target: "node",
	optimization: {
		minimize: false,
	},
	entry: {
		server: "./server.js",
	},
	output: {
		path: path.resolve(__dirname, "../../output/crusher-app"),
		chunkFilename: `[name]-[chunkhash:4].js`,
		sourceMapFilename: `[name]-[chunkhash:4].js.map`,
		libraryTarget: "commonjs2",
		clean: false,
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		mainFields: ["main", "module"],
	},
};
