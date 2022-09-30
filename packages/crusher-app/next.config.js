const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

const withImages = require("next-images");
const path = require("path");

const CopyPlugin = require("copy-webpack-plugin");

module.exports = withImages(
	withBundleAnalyzer({
		target: process.env.PACKAGE_VERCEL ? "serverless" : "server",
		distDir: "../../output/crusher-app/.next",
		typescript: {
			ignoreBuildErrors: true,
		},
		experimental: { esmExternals: false },
		webpack: function (config, { defaultLoaders }) {
			const resolvedBaseUrl = path.resolve(config.context, "../");
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
			NEXT_PUBLIC_GITHUB_APP_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_APP_CLIENT_ID,
			NEXT_PUBLIC_GITHUB_APP_PUBLIC_LINK: process.env.NEXT_PUBLIC_GITHUB_APP_PUBLIC_LINK,
			NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/server",
			FRONTEND_SERVER_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
			IS_DEVELOPMENT: process.env.NEXT_PUBLIC_IS_DEVELOPMENT,
		},
		eslint: {
			// Warning: Dangerously allow production builds to successfully complete even if
			// your currentProject has ESLint errors.
			ignoreDuringBuilds: true,
		},
		productionBrowserSourceMaps: false,
	}),
);
