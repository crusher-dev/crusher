module.exports = {
	env: {
		node: true,
		browser: true,
		es6: true,
	},
	extends: [`eslint:recommended`, `plugin:@typescript-eslint/recommended`, `plugin:prettier/recommended`],
	parser: `@typescript-eslint/parser`,
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: `module`,
	},
	plugins: [`@typescript-eslint`],
	rules: {
		'linebreak-style': [`error`, `unix`],
		indent: ['error', 'tab'],
	},
};
