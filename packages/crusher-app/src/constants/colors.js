// These are available and can be controlled by
const FUNDATMENTAL_COLORS = {
	grey: "grey",
};

const getColorsSet = (light, dark) => {
	light, dark;
};

// For times when utility classes are not enough
// This prevents from writing lot of CSS without ref
const TEMPLATE_COLORS = {
	bodyColor: getColorsSet("red", "green"),
};

export const useVar = (value) => {
	const variableName = Object.keys(TEMPLATE_COLORS).find((key) => TEMPLATE_COLORS[key] === value);
	if (!variableName) console.warn("No key found for template colors");
	return `var(--${variableName})`;
};

export const convertThemeObjectToInlineStyle = (themeName) => {
	return Object.keys(TEMPLATE_COLORS)
		.map((key) => `--${key}: ${TEMPLATE_COLORS[key][themeName]}`)
		.join(";");
};
