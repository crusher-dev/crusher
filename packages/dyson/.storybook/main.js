const path = require("path");
module.exports = {
	stories: [
		"../src/**/*.stories.mdx",
		"../src/**/*.stories.@(js|jsx|ts|tsx)"
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		// "@storybook/preset-create-react-app",
		"@etchteam/storybook-addon-status/register",
		"storybook-addon-designs",
		"@storybook/addon-notes/register",
	],
	webpackFinal: async (config) => {
		config.module.rules.push({
			test: /\.css$/,
			use: [
				{
					loader: "postcss-loader",
					options: {
						postcssOptions: {
							plugins: [require("tailwindcss"), require("autoprefixer")],
						},
					},
				},
			],
			include: path.resolve(__dirname, "../"),
		});

		// Add Webpack rules for TypeScript
		// ========================================================
		config.module.rules.push({
			test: /\.(ts|tsx)$/,
			loader: require.resolve("babel-loader"),
			options: {
				presets: [["react-app", { flow: false, typescript: true }], require.resolve("@emotion/babel-preset-css-prop")],
				// ... other configs
			},
		});

		return config;
	},
};
