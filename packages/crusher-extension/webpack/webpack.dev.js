const path = require("path");
const webpack = require("webpack");
const ExtensionReloader = require("webpack-extension-reloader");
const mkdirp = require("mkdirp");
const fsSystem = require("fs");

fsSystem.join = path.join.bind(path); // no need to bind
fsSystem.mkdirp = mkdirp.bind(mkdirp);

const customPath = path.join(__dirname, "./customPublicPath");
const host = "localhost";
const port = 2400;
module.exports = {
  mode: "development", // The plugin is activated only if mode is set to development
  watch: true,
  externals: ["fs", "request", "yamlparser"],
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
        NODE_ENV: JSON.stringify("development"),
      },
    }),
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../dev/js/"),
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
          presets: [
            "@babel/preset-env",
            "@babel/preset-react",
            "@emotion/babel-preset-css-prop",
          ],
          plugins: [["@babel/plugin-transform-react-jsx", { pragma: "h" }]],
        },
      },
      { test: /\.ts(x)?$/, loader: "ts-loader" },
    ],
  },
  devtool: "cheap-module-source-map",
};
