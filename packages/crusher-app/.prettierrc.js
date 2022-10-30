module.exports = {
	trailingComma: "all",
	useTabs: true,
	tabWidth: 2,
	printWidth: 160,
	singleQuote: false,
	jsxSingleQuote: false,
	importOrder: ["(.*)(react|next)(.*)$", "(.*)(jotai|swr|immer|emotion|lodash|axios)(.*)$", "(.*)(dyson|next)(.*)$", "(@|crusher-app)(.*)", ".(.*)"],
	importOrderSeparation: true,
	plugins: ["prettier-plugin-tailwindcss", "@trivago/prettier-plugin-sort-imports/"],
};
