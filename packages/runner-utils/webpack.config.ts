//webpack.config.js
const path = require('path');

module.exports = {
	mode: "development",
	devtool: "inline-source-map",
	entry: {
		actions: "./src/actions/index.ts",
		index: "./src/index.ts",
		functions: "./src/actions/index.ts",
		middlewares: "./src/middlewares/index.ts",
		utils: "./src/utils/index.ts"
	},
	output: {
		path: path.resolve(__dirname, './build'),
		filename: "[name].js" // <--- Will be compiled to this single file
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader"
			}
		]
	}
};
