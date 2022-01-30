const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
	mode: "production",
	devtool: "source-map",
	target: "node",
	entry: {
		index: "./index.ts",
	},
	optimization: {
		minimize: false,
	},
	output: {
		libraryTarget: "commonjs",
		path: path.resolve(__dirname, "../../output/video-processor/"),
		filename: "[name].js", // <--- Will be compiled to this single file
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		alias: resolveTsconfigPathsToAlias({
			tsconfigPath: "./tsconfig.json", // Using custom path
			webpackConfigBasePath: "./", // Using custom path
		}),
	},
	externals: {
		// kcors: 'kcors',
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
	plugins: [
		new webpack.DefinePlugin({
			"process.env.FLUENTFFMPEG_COV": false,
		}),
		new CopyPlugin({
			patterns: [{ from: `${path.dirname(require.resolve("bullmq"))}/commands/`, to: "commands/", globOptions: { ignore: ["**/*.js", "**/*.ts"] } }],
		}),
		new CopyPlugin({
			patterns: [{ from: path.resolve(__dirname, ".env") }],
		}),
	],
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
	paths &&
		Object.keys(paths).forEach((item) => {
			const modifiedKey = item.replace("/*", "");

			const aliasItems = paths[item];

			const processedAliases = Array.isArray(aliasItems) ? aliasItems.map((alias) => getItemName(alias)) : getItemName(aliasItems);

			aliases[modifiedKey] = processedAliases;
		});

	return aliases;
}
