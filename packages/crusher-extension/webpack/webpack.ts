import * as path from "path";
import * as webpack from "webpack";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: {
		content_script: [
			path.resolve(__dirname, "../src/scripts/inject/events_listener.ts"),
		],
		change_navigator: [
			path.resolve(__dirname, "../src/scripts/inject/change_navigator.ts"),
		],
		background: [path.resolve(__dirname, "../src/background.ts")],
		popup: [path.resolve(__dirname, "../src/ui/popup.tsx")],
		init: [path.resolve(__dirname, "../src/scripts/inject/init.ts")],
		record_test: [path.resolve(__dirname, "../src/ui/app.tsx")],
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: "public/", to: "../" }],
			options: {
				concurrency: 50,
			},
		}),
		new webpack.DefinePlugin({
			NODE_ENV: "production",
			"process.env": {
				BACKEND_URL: JSON.stringify(
					process.env.BACKEND_URL
						? process.env.BACKEND_URL
						: "https://backend.crusher.dev/",
				),
			},
		}),
	],
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "../build/js/"),
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"],
		modules: ["node_modules"],
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
		],
	},
	devtool: "cheap-module-source-map",
};
