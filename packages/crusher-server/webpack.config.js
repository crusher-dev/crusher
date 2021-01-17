//webpack.config.js
const path = require('path');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	target: "node",
	entry: {
		index: "./src/app.ts",
	},
	output: {
		path: path.resolve(__dirname, './build'),
		filename: 'app.js',
		chunkFilename: `[name]-[chunkhash:4].js`,
		sourceMapFilename: `[name]-[chunkhash:4].js.map`,
		libraryTarget: 'umd',
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
