import * as webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import { IgnorePlugin } from "webpack";

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');


require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const fs = require("fs");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

// Remove output directory
const OUTPUT_DIR = path.resolve(__dirname, "../../../output/crusher-electron-app/");
if (fs.existsSync(OUTPUT_DIR)) {
	fs.rmdirSync(OUTPUT_DIR, { force: true, recursive: true });
}

const isDevelopment = true;

const commonConfig = {
	mode: process.env.NODE_ENV || "development",
	plugins: [
		isDevelopment && new ReactRefreshWebpackPlugin(),
		new IgnorePlugin({ resourceRegExp: /^fsevents$/ }),	new MiniCssExtractPlugin()],
	module: {
		rules: [

			{
				test: /\.[jt]sx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: require.resolve('ts-loader'),
						options: {
							getCustomTransformers: () => ({
								before: [isDevelopment && ReactRefreshTypeScript()].filter(Boolean),
							}),
							transpileOnly: isDevelopment,
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

const finalConfig = [

	{
		...commonConfig,
		entry: { renderer: path.resolve(__dirname, "../src/_ui/index") },
		target: "electron-renderer",
		devServer: {
			hot: true,
			liveReload: false,
		},
		plugins: [
			...commonConfig.plugins,
			 new webpack.HotModuleReplacementPlugin(),
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
	},
];

module.exports = finalConfig.filter((config) => config !== null);
