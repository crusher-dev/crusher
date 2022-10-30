const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
	mode: "production",
	target: "node",
	devtool: "source-map",
	optimization: {
		minimize: false,
	},
	entry: {
		index: "./index.ts",
		worker: ["./src/worker/index.ts"],
		master: "bullmq/dist/esm/classes/master.js",
	},
	output: {
		libraryTarget: "commonjs2",
		path: path.resolve(__dirname, "../../output/test-runner/"),
		filename: "[name].js", // <--- Will be compiled to this single file
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: `../code-generator/src/parser/code.template.ejs` }],
		}),
		new webpack.DefinePlugin({
			"process.env.FLUENTFFMPEG_COV": false,
		}),
		new CopyPlugin({
			patterns: [{ from: `${path.dirname(require.resolve("bullmq"))}/commands/`, to: "commands/", globOptions: { ignore: ["**/*.js", "**/*.ts"] } }],
		}),
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, `../../output/crusher-runner-utils/`),
					to: "crusher-runner-utils.ts/",
				},
			],
		}),
		new CopyPlugin({
			patterns: [{ from: path.resolve(__dirname, ".env") }],
		}),
	],
	externals: [{
		fsevents: "require('fsevents')"
	}],
	resolve: {
		plugins: [new TsconfigPathsPlugin({ configFile: path.resolve("./tsconfig.json") })],
		extensions: [".ts", ".tsx", ".js"],
		mainFields: ["main", "module"],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				options: {
					transpileOnly: true,
				},
			},
			{
				test: /node_modules\/bullmq\/dist\/esm\/classes\/redis-connection\.js$/,
				use: {
					loader: "string-replace-loader",
					options: {
						search: "__dirname, '../commands'",
						replace: `__dirname, './commands'`,
					},
				},
			},
			{
				test: /node_modules\/bullmq\/dist\/esm\/classes\/child-processor\.js$/,
				use: {
					loader: "string-replace-loader",
					options: {
						search: "require(processorFile)",
						replace: `typeof __webpack_require__ === "function" ? __non_webpack_require__(processorFile) : require(processorFile)`,
					},
				},
			},
			{
				test: /node_modules\/bullmq\/dist\/cjs\/classes\/redis-connection\.js$/,
				use: {
					loader: "string-replace-loader",
					options: {
						search: "__dirname, '../commands'",
						replace: `__dirname, './commands'`,
					},
				},
			},
			{
				test: /node_modules\/bullmq\/dist\/cjs\/classes\/child-processor\.js$/,
				use: {
					loader: "string-replace-loader",
					options: {
						search: "require(processorFile)",
						replace: `typeof __webpack_require__ === "function" ? __non_webpack_require__(processorFile) : require(processorFile)`,
					},
				},
			},
		],
	},
};
