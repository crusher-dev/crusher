const path = require("path");

async function headers() {
	return [
		{
			source: '/assets/fonts/:path*',
			headers: [
				{
					key: 'Cache-Control',
					value: '2592000',
				},
			],
		},
	]
}



module.exports = {
	typescript: {
		ignoreBuildErrors: true,
	},
	compiler: {
		emotion: {
			// default is true. It will be disabled when build type is production.
			sourceMap: true,
			// default is 'dev-only'.
			autoLabel: "never",
			// default is '[local]'.
			// Allowed values: `[local]` `[filename]` and `[dirname]`
			// This option only works when autoLabel is set to 'dev-only' or 'always'.
			// It allows you to define the format of the resulting label.
			// The format is defined via string where variable parts are enclosed in square brackets [].
			// For example labelFormat: "my-classname--[local]", where [local] will be replaced with the name of the variable the result is assigned to.
		},
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
	productionBrowserSourceMaps: true,
	headers

};


