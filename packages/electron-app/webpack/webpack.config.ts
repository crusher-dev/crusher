import * as webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import { IgnorePlugin } from "webpack";

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const fs = require("fs");
const dotEnv = require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const CopyPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const extensionConfig = process.env.DO_NOT_BUILD_EXTENSION !== "undefined" ? require("./webpack.extension") : null;

// Remove output directory
const OUTPUT_DIR = path.resolve(__dirname, "../../../output/crusher-electron-app/");
if (fs.existsSync(OUTPUT_DIR)) {
	fs.rmdirSync(OUTPUT_DIR, { force: true, recursive: true });
}

const commonConfig = {
	mode: process.env.NODE_ENV || "development",
	plugins: [new IgnorePlugin({ resourceRegExp: /^fsevents$/ }), new MiniCssExtractPlugin()],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: "swc-loader",
						options: {
							jsc: {
								parser: {
									syntax: "typescript",
								},
							},
						},
					},
				],
			},
			{
				test: /\.css$/i,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
					},
				],
			},
			{
				test: /\.(woff|woff2|ttf|eot)$/,
				use: "file-loader?name=fonts/[name].[ext]!static",
			},
		],
	},
	output: {
		filename: "[name].js",
		path: OUTPUT_DIR,
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		plugins: [new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, "../tsconfig.json") })],
	},
	optimization: {
		minimize: false,
	},
};

let injectedEnv: any = {};
if (process.env.SEGMENT_API_KEY) {
	injectedEnv["SEGMENT_API_KEY"] = process.env.SEGMENT_API_KEY;
}

const finalConfig = [
	extensionConfig,
	{
		...commonConfig,
		target: "electron-main",
		plugins: [
			new IgnorePlugin({ resourceRegExp: /^fsevents$/ }),
			new webpack.EnvironmentPlugin({
				NODE_ENV: "production",
				...injectedEnv,
				...dotEnv.parsed,
			}),
			new CopyPlugin({
				patterns: [
					{ from: path.dirname(require.resolve("playwright/package.json")), to: "playwright" },
					{ from: path.dirname(require.resolve("playwright-core/package.json")), to: "playwright/node_modules/playwright-core" },
				],
			}),
			new CopyPlugin({
				patterns: [
					{ from: "package.release.json", to: "package.json" },
					{ from: "static", to: "static" },
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
		entry: { renderer: path.resolve(__dirname, "../src/_ui/index") },
		target: "electron-renderer",
		plugins: [
			...commonConfig.plugins,
			new HtmlWebpackPlugin({
				template: path.join(__dirname, "../static", "index.html"),
				chunks: ["renderer"],
			}),
			new webpack.DefinePlugin({
				NODE_ENV: process.env.NODE_ENV === "development" ? "development" : "production",
				"process.env": {
					BACKEND_URL: JSON.stringify(process.env.BACKEND_URL ? process.env.BACKEND_URL : "https://backend.crusher.dev/"),
					FRONTEND_URL: JSON.stringify(process.env.FRONTEND_URL ? process.env.FRONTEND_URL : "https://app.crusher.dev/"),
				},
			}),
		],
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					/* additional options here */
				}),
			],
		},
		// externals: ["snappy"],
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
