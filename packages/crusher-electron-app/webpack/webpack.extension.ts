import * as path from "path";
import * as webpack from "webpack";
import * as fs from "fs";
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const OUTPUT_DIR = path.resolve(__dirname, "../../../output/crusher-electron-app/extension/js");

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
  let pwQuerySelector;
  (() => {
    ${injectedScriptSource.source}
    const injected = new pwExport(1, false, []);
    window.injected = injected;
    pwQuerySelector = (selector, root) => {
      const parsed = injected.parseSelector(selector);
      return injected.querySelector(parsed, root);
    };
  })();
  module.exports = { querySelector: pwQuerySelector };`,
});

const TEMPLATES_DIR = path.resolve(__dirname, "../src/extension/ui/templates");

function getHTMLWebpackPluginConfigArrForTemplates() {
	const files = fs.readdirSync(TEMPLATES_DIR);
	return files.map((templateFileName) => {
		return new HtmlWebpackPlugin({
			template: path.resolve(TEMPLATES_DIR, templateFileName),
			templateParameters: { env: "prod" },
			inject: false,
			filename: `../${templateFileName.replace(".pug", ".html")}`,
		});
	});
}

let finalConfig: any = {
	mode: "production",
	entry: {
		content_script: [path.resolve(__dirname, "../src/extension/scripts/inject/events_listener.ts")],
		init_content_script: [path.resolve(__dirname, "../src/extension/scripts/inject/init_event_listener.ts")],
		change_navigator: [path.resolve(__dirname, "../src/extension/scripts/inject/change_navigator.ts")],
		background: [path.resolve(__dirname, "../src/extension/background.ts")],
		record_test: [path.resolve(__dirname, "../src/extension/ui/app.tsx")],
	},
	plugins: [
		virtualModules,
		...getHTMLWebpackPluginConfigArrForTemplates(),
		new CopyPlugin({
			patterns: [{ from: "public/", to: "../" }],
			options: {
				concurrency: 50,
			},
		}),
		new webpack.DefinePlugin({
			NODE_ENV: process.env.NODE_ENV === "development" ? "development" : "production",
			"process.env": {
				BACKEND_URL: JSON.stringify(process.env.BACKEND_URL ? process.env.BACKEND_URL : "https://backend.crusher.dev/"),
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
					presets: ["@babel/preset-env", "@babel/preset-react"],
					plugins: [["@babel/plugin-transform-react-jsx", { pragma: "h" }]],
				},
			},
			{ test: /\.ts(x)?$/, loader: "ts-loader" },
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
	const ExtensionReloader = require("webpack-extension-reloader");
	const RunElectronOnFirstCompile = require("./plugin/runElectronFirstCompile");

	finalConfig = {
		...finalConfig,
		plugins: [
			...finalConfig.plugins,
			new ExtensionReloader({
				isElectron: true,
				port: 2400, // Which port use to create the server
				reloadPage: true, // Force the reload of the page also
				entries: {
					background: "background",
					extensionPage: ["record_test"],
					contentScript: ["content_script"],
				},
			}),
			new RunElectronOnFirstCompile(),
		],
		mode: "development",
		watch: true,
	};
}

module.exports = smp.wrap(finalConfig);
