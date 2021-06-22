//webpack.config.js
const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
	mode: "production",
	target: "node",
	entry: {
		index: "./index.ts",
		worker: ["src/worker.ts"],
		master: "bullmq/dist/classes/master.js",
	},
	output: {
		libraryTarget: "commonjs",
		path: path.resolve(__dirname, "../../output/test-runner/"),
		filename: "[name].js", // <--- Will be compiled to this single file
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.FLUENTFFMPEG_COV": false,
		}),
		new CopyPlugin({
			patterns: [{ from: `${path.dirname(require.resolve("bullmq"))}/commands/`, to: "commands/", globOptions: { ignore: ["**/*.js", "**/*.ts"] } }],
		}),
		new CopyPlugin({
			patterns: [
				{
					from: `../runner-utils/build`,
					to: "crusher-runner-utils/",
				},
			],
		}),
		new CopyPlugin({
			patterns: [{ from: path.resolve(__dirname, ".env") }],
		}),
	],
	externals: ["crusher_runner_utils"],
	resolve: {
		plugins: [new TsconfigPathsPlugin({ configFile: path.resolve("./tsconfig.json") })],
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
						replace: `__dirname + "/commands/"`,
					},
				},
			},
			{
				test: /node_modules\/bullmq\/dist\/classes\/master\.js$/,
				use: {
					loader: "string-replace-loader",
					options: {
						search: "require(msg.value)",
						replace: `typeof __webpack_require__ === "function" ? __non_webpack_require__(msg.value) : require(msg.value)`,
					},
				},
			},
		],
	},
};
