// .storybook/YourTheme.js

import { create } from "@storybook/theming";

export default create({
	base: "dark",

	// UI
	appBg: "#0C0C0D",
	appContentBg: "#0C0C0D",
	appBorderColor: "#0C0D0F",
	appBorderRadius: 4,

	// Text colors
	textColor: "#fff",
	textInverseColor: "rgba(255,255,255,0.9)",

	// Toolbar default and active colors
	barTextColor: "#ffffff",
	barSelectedColor: "#fff",
	barBg: "#202226",

	// Form colors
	inputBg: "#100f0f",
	inputBorder: "silver",
	inputTextColor: "#fff",
	inputBorderRadius: 4,
});
