const commonWebpackConfig = require('./webpack.config.common');
const path = require('path');

module.exports = {
	...commonWebpackConfig,
	mode: 'development',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 9000,
	},
	devtool: 'inline-source-map',
};
