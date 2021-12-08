const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");

const withImages = require("next-images");
const path = require("path");

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const CopyPlugin = require("copy-webpack-plugin");
const withPWA = require("next-pwa");

module.exports = withImages(
	withBundleAnalyzer({
		target: process.env.PACKAGE_VERCEL ? "serverless" : "server",
		distDir: "../../output/crusher-app/.next",
		typescript: {
			ignoreBuildErrors: true,
		},
		webpack: function (config, { defaultLoaders }) {
			const resolvedBaseUrl = path.resolve(config.context, "../");
			if (IS_PRODUCTION) {
				config.module.rules.filter(({ loader }) => loader === "babel-loader").map((l) => (l.options.cacheDirectory = false));

				config.plugins.push(new DuplicatePackageCheckerPlugin());
			}

			config.module.rules = [
				...config.module.rules,
				{
					test: /\.(tsx|ts|js|mjs|jsx)$/,
					include: [resolvedBaseUrl],
					use: defaultLoaders.babel,
					exclude: (excludePath) => {
						return /node_modules/.test(excludePath);
					},
				},
			];

			config.plugins.push(
				new CopyPlugin({
					patterns: [
						{
							from: "./package.json",
							to: "../package.json",
						},
						{
							from: "./server.js",
							to: "../server.js",
						},
						{
							from: "./public",
							to: "./public",
						},
					],
				}),
				new CopyPlugin({
					patterns: [{ from: path.resolve(__dirname, ".env") }],
				}),
			);

			return config;
		},
		env: {
			GITHUB_APP_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_APP_CLIENT_ID,
			NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/server",
			FRONTEND_SERVER_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
			IS_DEVELOPMENT: process.env.NEXT_PUBLIC_IS_DEVELOPMENT,
		},
		eslint: {
			// Warning: Dangerously allow production builds to successfully complete even if
			// your currentProject has ESLint errors.
			ignoreDuringBuilds: true,
		},
		productionBrowserSourceMaps: true,
	}),
);
