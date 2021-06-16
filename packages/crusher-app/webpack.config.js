const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  target: "node",
  entry: {
    server: "./server.js",
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    chunkFilename: `[name]-[chunkhash:4].js`,
    sourceMapFilename: `[name]-[chunkhash:4].js.map`,
    libraryTarget: 'umd',
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: `.next/`, to: ".next/" }],
    }),
  ],
};