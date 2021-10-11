const commonWebpackConfig = require("./webpack.config.common");

module.exports = {
	...commonWebpackConfig,
	mode: "production",
	optimization: {
		minimize: false,
	},
};
