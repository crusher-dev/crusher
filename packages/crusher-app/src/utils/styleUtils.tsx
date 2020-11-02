import {
	DEFAULT_THEME,
	FIGMA_REM_COEFFICIENT,
	SUPPORTED_THEME,
} from "@constants/style";
import { setCookie } from "nookies";
import { getCookies } from "@utils/cookies";

export const getThemeFromCookie = (ctx = null) => {
	const { req, query } = ctx;
	if (query.theme) return query.theme;
	const cookies = getCookies(req);
	const current_theme = SUPPORTED_THEME.includes(cookies.theme)
		? cookies.theme
		: DEFAULT_THEME;

	if (ctx) {
		setCookie(ctx, "theme", current_theme, {
			maxAge: 30 * 24 * 60 * 60,
			path: "/",
		});
	}

	return current_theme;
};

export const getStyleFromObject = (styleObject, theme) => {
	const [dark, light] = styleObject;
	if (theme === "dark") return dark;
	return light;
};

// Used to convert values in figma to rem, which are adjusted to screen size.
export const getRelativeSize = (sizeInPx: number): number =>
	sizeInPx / FIGMA_REM_COEFFICIENT;
