const extensionWebpackConfig = require("./webpack.extension");
const ExtensionReloader = require("webpack-extension-reloader");

module.exports = {
	...extensionWebpackConfig,
	plugins: [
		new ExtensionReloader({
			port: 2400, // Which port use to create the server
			reloadPage: true, // Force the reload of the page also
			entries: {
				contentScript: ["content_script", "change_navigator"],
				background: "background",
				extensionPage: ["popup", "record_test"],
			},
		}),
		...extensionWebpackConfig.plugins,
	],
	mode: "development",
	watch: true,
};
