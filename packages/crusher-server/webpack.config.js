// //webpack.config.js
// const path = require('path');
//
// module.exports = {
// 	mode: "development",
// 	devtool: "inline-source-map",
// 	target: "node",
// 	entry: {
// 		index: "./src/app.ts",
// 	},
// 	output: {
// 		libraryTarget: 'commonjs',
// 		path: path.resolve(__dirname, './build'),
// 		filename: "[name].js" // <--- Will be compiled to this single file
// 	},
// 	resolve: {
// 		extensions: [".ts", ".tsx", ".js"],
// 	},
// 	module: {
// 		rules: [
// 			{
// 				test: /\.tsx?$/,
// 				loader: "ts-loader"
// 			}
// 		]
// 	}
// };

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
		libraryTarget: 'commonjs',
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	// optimization: {
	// 	splitChunks: {
	// 		chunks: 'initial',
	// 		minSize: 210000,
	// 		maxSize: 500000,
	// 	}
	// },
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader"
			}
		]
	}
};
