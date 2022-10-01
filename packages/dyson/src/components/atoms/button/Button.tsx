import React from "react";
import { css, SerializedStyles } from "@emotion/react";
import { colors } from "../../../constant/color";

const getStyleBySize = (
	size: string,
): {
	height: number;
	fontSize: number;
	fontWeight: number;
} => {
	switch (size) {
		case "tiny":
			return { height: 24, fontSize: 12, fontWeight: 500 };
			break;
		case "x-small":
			return { height: 28, fontSize: 12.5, fontWeight: 500 };
			break;
		case "small":
			return { height: 32, fontSize: 14, fontWeight: 500 };
			break;
		case "medium":
			return { height: 36, fontSize: 14, fontWeight: 500 };
			break;
		case "big-medium":
			return { height: 40, fontSize: 14, fontWeight: 500 };
			break;
		case "large":
			return { height: 44, fontSize: 15, fontWeight: 500 };
			break;
		case "x-large":
			return { height: 52, fontSize: 16, fontWeight: 500 };
			break;
		default:
			return { height: 24, fontSize: 12, fontWeight: 500 };
	}
};

type Color = {
	background: string;
	border: string;
	color: string;
};
const getColor = (color: string, impact: string): { main: Color; hover: Color } => {
	const finalColor = color === "primary" ? color + "-" + impact : color;

	switch (finalColor) {
		case "primary-high":
			return {
				main: { background: "#b341f9", border: "#b341f9", color: "#fff" },
				hover: { background: "#6749de", border: "#6749de", color: "#fff" },
			};
			break;
		case "primary-medium":
			return {
				main: { background: "#917DFA", border: "#917DFA", color: "#171522" },
				hover: { background: "#917DFA", border: "#917DFA", color: "#171522" },
			};
			break;
		case "primary-low":
			return {
				main: { background: "rgba(0,0,0,0)", border: "#917DFA", color: "#917DFA" },
				hover: { background: "rgba(0,0,0,0)", border: "#917DFA", color: "#917DFA" },
			};
			break;
		case "secondary-pink":
			return {
				main: { background: "#F471CF", border: "#F471CF", color: "#fff" },
				hover: { background: "#F471CF", border: "#F471CF", color: "#fff" },
			};
			break;
		case "secondary-green":
			return {
				main: { background: "#A5EA6F", border: "#A5EA6F", color: "#333F24" },
				hover: { background: "#A5EA6F", border: "#A5EA6F", color: "#333F24" },
			};
			break;
		case "tertiary-white-outline":
			return {
				main: { background: "rgba(0,0,0,0)", border: "rgba(255, 255, 255, 0.66)", color: "#fff" },
				hover: { background: "rgba(0,0,0,0)", border: "rgba(255, 255, 255, 0.66)", color: "#fff" },
			};
			break;
		case "tertiary-white":
			return {
				main: { background: "#fff", border: "#fff", color: "#0B0B0D" },
				hover: { background: "#fff", border: "#fff", color: "#0B0B0D" },
			};
			break;
		case "tertiary-dark":
			return {
				main: { background: "#0B0B0D", border: "#292d33", color: "#fff" },
				hover: { background: "#0B0B0D", border: "#292d33", color: "#fff" },
			};
			break;
		case "tertiary":
			return {
				main: { background: "#1E242C", border: "#353e4b", color: "#fff" },
				hover: { background: "#1E242C", border: "#353e4b", color: "#fff" },
			};
			break;
		case "danger":
			return {
				main: {
					background: colors.RED[600],
					border: colors.RED[600], color: "#fff"
				},
				hover: { background: colors.RED[700], border: colors.RED[700], color: "#fff" },
			};
			break;
		default:
			return {
				main: { background: "#8860DE", border: "#8860DE", color: "#fff" },
				hover: { background: "#8860DE", border: "#8860DE", color: "#fff" },
			};
			break;
	}

	// const finalColor = color === "primary" ? color + "-" + impact : color;

	switch (finalColor) {
		case "primary-high":
			return {
				main: { background: "#b341f9", border: "#b341f9", color: "#fff" },
				hover: { background: "#b341f9", border: "#b341f9", color: "#fff" },
			};
			break;
		case "primary-medium":
			return {
				main: { background: "#917DFA", border: "#917DFA", color: "#171522" },
				hover: { background: "#917DFA", border: "#917DFA", color: "#171522" },
			};
			break;
		case "primary-low":
			return {
				main: { background: "rgba(0,0,0,0)", border: "#917DFA", color: "#917DFA" },
				hover: { background: "rgba(0,0,0,0)", border: "#917DFA", color: "#917DFA" },
			};
			break;
		case "secondary-pink":
			return {
				main: { background: "#F471CF", border: "#F471CF", color: "#fff" },
				hover: { background: "#F471CF", border: "#F471CF", color: "#fff" },
			};
			break;
		case "secondary-green":
			return {
				main: { background: "#A5EA6F", border: "#A5EA6F", color: "#333F24" },
				hover: { background: "#A5EA6F", border: "#A5EA6F", color: "#333F24" },
			};
			break;
		case "tertiary-white-outline":
			return {
				main: { background: "rgba(0,0,0,0)", border: "rgba(255, 255, 255, 0.66)", color: "#fff" },
				hover: { background: "rgba(0,0,0,0)", border: "rgba(255, 255, 255, 0.66)", color: "#fff" },
			};
			break;
		case "tertiary-white":
			return {
				main: { background: "#fff", border: "#fff", color: "#0B0B0D" },
				hover: { background: "#fff", border: "#fff", color: "#0B0B0D" },
			};
			break;
		case "tertiary-dark":
			return {
				main: { background: "#0B0B0D", border: "#292d33", color: "#fff" },
				hover: { background: "#0B0B0D", border: "#292d33", color: "#fff" },
			};
			break;
		case "tertiary":
			return {
				main: { background: "#1E242C", border: "#353e4b", color: "#fff" },
				hover: { background: "#1E242C", border: "#353e4b", color: "#fff" },
			};
			break;
		case "danger":
			return {
				main: {
					background: colors.RED[600],
					border: colors.RED[600], color: "#fff"
				},
				hover: { background: colors.RED[700], border: colors.RED[700], color: "#fff" },
			};
			break;
		default:
			return {
				main: { background: "#8860DE", border: "#8860DE", color: "#fff" },
				hover: { background: "#8860DE", border: "#8860DE", color: "#fff" },
			};
			break;
	}
};

type primaryButton = "primary";
type whiteColors = "white" | "white-grey" | "white-outline" | "white-blank" | "white-dashed";
type otherColors = "blue" | "green" | "cyan" | "danger";
type otherButtonTypes = "link" | "disabled";

export type ButtonProps = {
	/**
	 * Is this the principal call to action on the page?
	 */
	impactLevel?: "high" | "medium" | "low" | null;
	/**
	 * What background color to use
	 */
	bgColor?: primaryButton | whiteColors | otherColors | otherButtonTypes;
	/**
	 * Size of the component
	 */
	size?: "tiny" | "x-small" | "small" | "medium" | "big-medium" | "large" | "x-large";

	/**
	 * Disabled;
	 */
	disabled?: boolean;
	/**
	 * Emotion CSS style if any
	 * @deprecated
	 */
	css?: SerializedStyles;
	CSS?: SerializedStyles;
	/**
	 * Input contents
	 */
	children: any;
	/**
	 * Optional click handler
	 */
	onClick?: (e: any) => void;
	className?: string;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, any>;

/*
	Note :- Change color and size thru switch statement
 */
/**
 * Unified button component for Dyson UI system
 */
export const Button: React.FC<ButtonProps> = React.forwardRef(
	({ bgColor = "primary", impactLevel = "high", size = "small", children, disabled = false, className, ...props }, ref) => {
		return (
			<button
				className={` rem-24 text-14 text-white ${className} leading-none`}
				css={[
					buttonCSS,
					// blue,
					getSize(size),
					disabled ? disabledButton : getColorCSS(bgColor, impactLevel, disabled),
					props.CSS,
				]}
				ref={ref}
				disabled={disabled}
				{...props}
			>
				{children}
			</button>
		);
	},
);

const buttonCSS = css`
	cursor: default;
	border-radius: 8rem;
	color: white;
	font-weight: 600;
	height: 32rem;
	padding: 0 12rem;
`;

const getColorCSS = (color: string, impact: string, disabled: boolean) => css`
	background: ${getColor(color, impact).main.background};
	color: ${getColor(color, impact).main.color};
	border: 1px solid ${getColor(color, impact).main.border};
	${disabled !== true &&
	`
			:hover {
				background: ${getColor(color, impact).hover.background};
				color: ${getColor(color, impact).hover.color};
				border: .5px solid ${getColor(color, impact).hover.border};
			}
	`}

	:hover {
		filter: brightness(75%);
	}
`;
const getSize = (size: string) => css`
	padding: 0 12rem;
	height: ${getStyleBySize(size).height}rem;
	font-size: ${getStyleBySize(size).fontSize}rem;
	font-weight: ${getStyleBySize(size).fontWeight}rem !important;
`;

const disabledButton = css`
	background: ${getColor("tertiary", "").main.background};
	color: ${getColor("tertiary", "").main.color};
	border: 1px solid ${getColor("tertiary", "impact").main.border};
	filter: brightness(60%);
`;
