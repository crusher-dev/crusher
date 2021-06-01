module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["@typescript-eslint"],
	rules: {
		"linebreak-style": ["error", "unix"],
		"no-var": "off",
		"no-async-promise-executor": "off",
		quotes: ["error", "double"],
	},
};
