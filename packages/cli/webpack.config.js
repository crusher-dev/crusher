const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const { FixSharedOutputPlugin } = require("./webpack/plugins/fixShardOutput");

console.log( glob.sync("./src/**/*.ts").reduce(function (obj, el) {
  obj[el.replace(".ts", "")] = {
    import: el,
    dependOn: "shared",
  };
  return obj;
}, {shared: "cli-ux"}));


const environmentVariables = {
  'process.env.DOWNLOADS_REPO_URL': 'https://github.com/crusherdev/crusher-downloads',
};
if(process.env.RECORDER_VERSION) {
  environmentVariables['process.env.RECORDER_VERSION'] = process.env.RECORDER_VERSION;
}
if(process.env.DOWNLOADS_REPO_URL) {
  environmentVariables['process.env.DOWNLOADS_REPO_URL'] = process.env.DOWNLOADS_REPO_URL;
}

module.exports = {
  mode: "production",
  entry: glob.sync("./src/**/*.ts").reduce(function (obj, el) {
    obj[el.replace(".ts", "")] = {
      import: el,
      dependOn: "./src/shared",
    };
    return obj;
  }, {"./src/shared": "cli-ux"}),
  node: {
    __dirname: false,
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../../output/crusher-cli"),
    libraryTarget: "commonjs-module",
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
    new webpack.DefinePlugin({
      ...environmentVariables
    }),
    new FixSharedOutputPlugin(),
  ],
};
