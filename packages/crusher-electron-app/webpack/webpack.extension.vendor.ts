import * as path from "path";
import * as webpack from "webpack";

module.exports = {
	mode: "production",
	entry: {
		vendor: [
			"react",
			"react-dom",
			"react-redux",
			"react-modal",
			"reactour",
			"body-scroll-lock",
			"lodash",
			"react-select",
			"redux",
			"redux-thunk",
			"redux-logger",
			"an-array-of-english-words",
			"html-tags",
			"react-is",
		],
	},
	output: {
		filename: "vendor.bundle.js",
		path: path.resolve(__dirname, "../build/js/"),
		library: "vendor_lib",
	},
	plugins: [
		new webpack.DllPlugin({
			name: "vendor_lib",
			path: path.resolve(__dirname, "../build/js", "vendor-manifest.json"),
			context: path.resolve(__dirname, "../"),
			entryOnly: true,
		}),
	],
};
