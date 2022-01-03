module.exports = {
	plugins: [
		require("postcss-import"),
		require("tailwindcss"),
		// [
		// 	'@fullhuman/postcss-purgecss',
		// 	{
		// 		content: ["./src/**/*.jsx", "./src/**/*.tsx", "./pages/**/*.tsx", "./pages/**/*.jsx"],
		// 		defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
		// 		safelist: ["html", "body"]
		// 	}
		// ],
	],
};
