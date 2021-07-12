import * as webpack from "webpack";

const fs = require("fs");
const path = require("path");

const dotEnv = require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const CopyPlugin = require("copy-webpack-plugin");
const extensionConfig = process.env.DO_NOT_BUILD_EXTENSION !== "undefined" ? require("./webpack.extension") : null;

const OUTPUT_DIR = path.resolve(__dirname, "../../../output/crusher-electron-app/");

fs.rmdirSync(OUTPUT_DIR, { force: true, recursive: true });

const commonConfig = {
	mode: process.env.NODE_ENV || "development",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
			},
		],
	},
	output: {
		filename: "[name].js",
		path: OUTPUT_DIR,
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
};

const finalConfig = [
	extensionConfig,
	{
		...commonConfig,
		target: "electron-main",
		plugins: [
			new webpack.EnvironmentPlugin({
				NODE_ENV: "production",
				...dotEnv.parsed,
			}),
			new CopyPlugin({
				patterns: [
					{ from: "package.release.json", to: "package.json" },
					{ from: "src/icons", to: "icons" },
				],
			}),
		],
		entry: {
			main: path.resolve(__dirname, "../src/main.ts"),
		},
	},
	{
		...commonConfig,
		target: "electron-preload",
		entry: {
			preload: path.resolve(__dirname, "../src/preload.ts"),
		},
	},
	{
		...commonConfig,
		target: "electron-preload",
		entry: {
			webViewPreload: path.resolve(__dirname, "../src/webViewPreload.ts"),
		},
	},
];

module.exports = finalConfig.filter((config) => config !== null);
