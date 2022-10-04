import * as path from "path";
import * as webpack from "webpack";
import * as fs from "fs";
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const OUTPUT_DIR = path.resolve(__dirname, "../../../output/crusher-electron-app/");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require("copy-webpack-plugin");
const VirtualModulesPlugin = require("webpack-virtual-modules");
const injectedScriptSource = require("playwright-core/lib/generated/injectedScriptSource");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const smp = new SpeedMeasurePlugin();

const virtualModules = new VirtualModulesPlugin({
	"../node_modules/playwright-evaluator.js": `
  let pwQuerySelector, pwQuerySelectorAll;
  (() => {
    ${injectedScriptSource.source}
    const injected = new InjectedScript(false,1, "chromium", []);
    window.injected = injected;
    pwQuerySelector = (selector, root) => {
      const parsed = injected.parseSelector(selector);
      return injected.querySelector(parsed, root);
    };
		pwQuerySelectorAll = (selector, root) => {
      const parsed = injected.parseSelector(selector);
      return injected.querySelectorAll(parsed, root);
    };
  })();

	window.pwQuerySelector = pwQuerySelector;
	window.pwQuerySelectorAll = pwQuerySelectorAll;
  module.exports = { querySelector: pwQuerySelector, querySelectorAll: pwQuerySelectorAll };`,
});

let finalConfig: any = {
	mode: "production",
	optimization: {
		minimize: false,
	},
	entry: {
		recorder: [path.resolve(__dirname, "../src/lib/recorder/events_listener.ts")],
	},
	plugins: [
		virtualModules,
		new webpack.DefinePlugin({
			NODE_ENV: process.env.NODE_ENV === "development" ? "development" : "production",
			"process.env": {
				BACKEND_URL: JSON.stringify(process.env.BACKEND_URL ? process.env.BACKEND_URL : "https://backend.crusher.dev/"),
				FRONTEND_URL: JSON.stringify(process.env.FRONTEND_URL ? process.env.FRONTEND_URL : "https://app.crusher.dev/"),
			},
		}),
	],
	output: {
		filename: "[name].js",
		path: OUTPUT_DIR,
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"],
		modules: ["node_modules"],
		plugins: [new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, "../tsconfig.json") })],
		fallback: {
			path: require.resolve("path-browserify"),
		},
	},
	module: {
		rules: [
			{
				// Include ts, tsx, js, and jsx files.
				test: /\.(js|jsx|ts|tsx)$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				options: {
					presets: ["@babel/preset-env", "@emotion/babel-preset-css-prop", "@babel/preset-react"],
					plugins: [["@babel/plugin-transform-react-jsx", { pragma: "h" }], "@emotion/babel-plugin"],
				},
			},
			{ test: /\.ts(x)?$/, loader: "ts-loader", options: { transpileOnly: true } },
			{ test: /\.pug$/, use: "pug-loader" },
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	devtool: "cheap-module-source-map",
};

if (process.env.NODE_ENV === "development") {
	finalConfig.watch = true;
}

module.exports = smp.wrap(finalConfig);
