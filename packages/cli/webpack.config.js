const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const { FixSharedOutputPlugin } = require("./webpack/plugins/fixShardOutput");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;
const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default;

console.log( glob.sync("./src/**/*.ts").reduce(function (obj, el) {
  obj[el.replace(".ts", "")] = {
    import: el,
    dependOn: "shared",
  };
  return obj;
}, {shared: "cli-ux"}));


const environmentVariables = {
  'process.env.DOWNLOADS_REPO_URL': JSON.stringify('https://github.com/crusher-dev/crusher-downloads/'),
};
if(process.env.RECORDER_VERSION) {
  environmentVariables['process.env.RECORDER_VERSION'] = JSON.stringify(process.env.RECORDER_VERSION);
}
if(process.env.DOWNLOADS_REPO_URL) {
  environmentVariables['process.env.DOWNLOADS_REPO_URL'] = JSON.stringify(process.env.DOWNLOADS_REPO_URL);
}

module.exports = {
  mode: "production",
  entry: glob.sync("./src/**/*.ts").reduce(function (obj, el) {
    obj[el.replace(".ts", "")] = {
      import: el
    };
    return obj;
  }, {}),
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
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
    new webpack.DefinePlugin({
      ...environmentVariables
    }),
    // new StatoscopeWebpackPlugin()
    // new FixSharedOutputPlugin(),
    // new BundleAnalyzerPlugin({generateStatsFile: true}),
    // new WebpackBundleSizeAnalyzerPlugin('./reports/plain-report.txt')
  ],
  optimization: {
    splitChunks: {
        cacheGroups: {
            vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                enforce: true,
                chunks: 'all'
            }
        }
    }
  }
};