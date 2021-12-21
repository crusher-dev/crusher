import * as webpack from "webpack";

const fs = require("fs");
const path = require("path");

const dotEnv = require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const CopyPlugin = require("copy-webpack-plugin");

const extensionConfig = process.env.DO_NOT_BUILD_EXTENSION !== "undefined" ? require("./webpack.extension") : null;

// Remove output directory
const OUTPUT_DIR = path.resolve(__dirname, "../../../output/crusher-electron-app/");
fs.rmdirSync(OUTPUT_DIR, { force: true, recursive: true });

const commonConfig = {
	mode: process.env.NODE_ENV || "development",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				options: {
					transpileOnly: true,
				},
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
	optimization: {
		minimize: false,
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
				patterns: [{ from: path.dirname(require.resolve("playwright/package.json")), to: "playwright" }],
			}),
			new CopyPlugin({
				patterns: [
					{ from: "package.release.json", to: "package.json" },
					{ from: "src/assets", to: "assets" },
				],
			}),
		],
		entry: {
			app: path.resolve(__dirname, "../src/main-process/main.ts"),
		},
		externals: ["playwright"],
	},
	{
		...commonConfig,
		target: "electron-preload",
		entry: {
			["renderer-preload"]: path.resolve(__dirname, "../src/preload/renderer.ts"),
		},
	},
	{
		...commonConfig,
		target: "electron-preload",
		entry: {
			["webview-preload"]: path.resolve(__dirname, "../src/preload/webview.ts"),
		},
	},
];

module.exports = finalConfig.filter((config) => config !== null);
