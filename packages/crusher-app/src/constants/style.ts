import { css } from "@emotion/react";
import React from "react";

export const FIGMA_REM_COEFFICIENT = 16;

export const COLORS = {
	white: "#FFFFFF",
	dark1: "#1C1F26",
	darkgrey: "#2A3039",
	lightgrey: "#364152",
};

export const FONT = {
	GILROY: "Gilroy",
	CERA: "Cera Prop",
};

export const FONT_WEIGHT = {
	GILROY: {
		REGULAR: "400",
		MEDIUM: "500",
		SEMIBOLD: "600",
		BOLD: "700",
		BLACK: "800",
	},
	CERA: {
		SEMIBOLD: "600",
		BOLD: "700",
		BLACK: "800",
	},
};

export const COMPONENTS = {
	dashboard: {
		background: [COLORS.dark1, COLORS.white],
	},
	font: {
		primary: [COLORS.white, COLORS.dark1],
	},
	button: {},
};

//Don't use this directly
export const SUPPORTED_THEME = ["dark", "light"];
export const DEFAULT_THEME = "light";
export const ThemeContext = React.createContext(DEFAULT_THEME);

export const plainButtonCSS = css`
	padding: 0 10rem;

	font-family: "Gilroy";
	font-style: normal;
	font-weight: 600;
	font-size: 13px;

	color: #ffffff;

	width: max-content;

	background: #cd60ff !important;
	border: 1px solid #7d41ad !important;;
	border-radius: 8px !important;;

	:hover {
		background: #cd60ff;
		filter: brighntess(0.7);
		border: 1px solid #7d41ad;
	}
`;
