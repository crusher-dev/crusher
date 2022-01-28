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
		app: "./src/app.ts",
		queue: "./src/queue.ts",
		cron: "./src/cron.ts",
		worker: "./src/modules/runner/workers/testCompleteWorker.ts",
		master: "bullmq/dist/cjs/classes/master.js",
		...getAllWorkers(),
	},
	output: {
		path: path.resolve(__dirname, "../../output/crusher-server"),
		chunkFilename: `[name]-[chunkhash:4].js`,
		sourceMapFilename: `[name]-[chunkhash:4].js.map`,
		libraryTarget: "commonjs2",
		clean: true,
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: `${path.dirname(require.resolve("bullmq"))}/commands/`, to: "cjs/commands/", globOptions: { ignore: ["**/*.js", "**/*.ts"] } }],
		}),
		new CopyPlugin({
			patterns: [{ from: path.resolve(__dirname, "src/modules/email/templates"), to: "email/templates" }],
		}),
		new CopyPlugin({
			patterns: [{ from: path.resolve(__dirname, ".env") }],
		}),
	],
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		mainFields: ["main", "module"],
		alias: {
			...resolveTsconfigPathsToAlias({
				tsconfigPath: "./tsconfig.json", // Using custom path
				webpackConfigBasePath: "../", // Using custom path
			}),
			"pg-native": path.resolve(__dirname, "./dummy-pg-native.js"),
		},
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
				test: /node_modules\/bullmq\/dist\/cjs\/commands\/index\.js$/,
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

/**
 * Resolve tsconfig.json paths to Webpack aliases
 * @param  {string} tsconfigPath           - Path to tsconfig
 * @param  {string} webpackConfigBasePath  - Path from tsconfig to Webpack config to create absolute aliases
 * @return {object}                        - Webpack alias config
 */
function resolveTsconfigPathsToAlias({ tsconfigPath = "./tsconfig.json", webpackConfigBasePath = __dirname } = {}) {
	const { paths } = require(tsconfigPath).compilerOptions;

	const aliases = {};

	const getItemName = (alias) => path.resolve(webpackConfigBasePath, alias.replace("/*", "").replace("*", ""));
	Object.keys(paths).forEach((item) => {
		const modifiedKey = item.replace("/*", "");

		const aliasItems = paths[item];

		const processedAliases = Array.isArray(aliasItems) ? aliasItems.map((alias) => getItemName(alias)) : getItemName(aliasItems);

		aliases[modifiedKey] = processedAliases;
	});

	return aliases;
}

function getAllWorkers() {
	return {
		"./src/modules/runner/workers/testCompleteWorker.ts": "./src/modules/runner/workers/testCompleteWorker.ts",
	};
}