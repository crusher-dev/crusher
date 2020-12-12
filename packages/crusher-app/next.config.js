const withCSS = require("@zeit/next-css");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});
const withImages = require("next-images");
const path = require("path");

module.exports = withImages(
	withCSS(
		withBundleAnalyzer({
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
				return config;
			},
			env: {
				BACKEND_URL: process.env.BACKEND_URL,
				FRONTEND_URL: process.env.FRONTEND_URL,
				IS_DEVELOPMENT: process.env.IS_DEVELOPMENT,
			},
		}),
	),
);
