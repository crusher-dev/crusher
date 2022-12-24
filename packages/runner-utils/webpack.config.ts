import path from "path";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

module.exports = {
	mode: "development",
	target: "node",
	optimization: {
		minimize: false,
	},
	entry: {
		index: "./src/index.ts",
	},
	output: {
		libraryTarget: "commonjs",
		path: path.resolve(__dirname, "../../output/crusher-runner-utils"),
		filename: "[name].js", // <--- Will be compiled to this single file
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		plugins: [new TsconfigPathsPlugin({ configFile: path.resolve("./tsconfig.json") })],
	},
	externals: ["playwright", {
		fsevents: "require('fsevents')"
	}],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "swc-loader",
					options: {
						jsc: {
							parser: {
								syntax: "typescript"
							}
						}
					}
				}
			}
		]
	}
};
