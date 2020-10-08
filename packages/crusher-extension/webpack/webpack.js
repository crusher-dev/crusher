const path = require("path");
const webpack = require("webpack");
const ExtensionReloader = require("webpack-extension-reloader");
const nodeExternals = require("webpack-node-externals");

const customPath = path.join(__dirname, "./customPublicPath");
const host = "localhost";
const port = 3000;

module.exports = {
  entry: {
    background: [customPath, path.resolve(__dirname, "../src/background.ts")],
    popup: [
      customPath,
      path.resolve(__dirname, "../src/ui/popup/index.tsx"),
    ],
    record_test: [
      customPath,
      path.resolve(__dirname, "../src/ui/testRecorder/index.tsx"),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __HOST__: `'${host}'`,
      __PORT__: port,
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../build/js/"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    // modules: ["node_modules"]
  },
  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: [["@babel/plugin-transform-react-jsx", { pragma: "h" }]],
        },
      },
      { test: /\.ts(x)?$/, loader: "ts-loader" },
    ],
  },
  devtool: "cheap-module-source-map",
};
