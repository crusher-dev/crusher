const withCSS = require("@zeit/next-css");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});
const withImages = require("next-images");
module.exports = withImages();

module.exports = withCSS(
	withBundleAnalyzer({
		env: {
			BACKEND_URL: process.env.BACKEND_URL,
			FRONTEND_URL: process.env.FRONTEND_URL,
			IS_DEVELOPMENT: process.env.IS_DEVELOPMENT,
		},
	}),
);
