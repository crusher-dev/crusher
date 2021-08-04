import React from "react";
import { css, SerializedStyles } from "@emotion/react";

export type ButtonProps = {
	/**
	 * Is this the principal call to action on the page?
	 */
	impactLevel?: "high" | "medium" | "low";
	/**
	 * What background color to use
	 */
	bgColor?: "blue" | "pink" | "green" | "tertiary-dark" | "tertiary" | "tertiary-white" | "disabled";
	/**
	 * Size of the component
	 */
	size?: "small" | "medium" | "large";

	/**
	 * Disabled;
	 */
	disabled?: boolean;
	/**
	 * Emotion CSS style if any
	 */
	css?: SerializedStyles;
	/**
	 * Input contents
	 */
	children: any;
	/**
	 * Optional click handler
	 */
	onClick?: () => void;
	className?: string;
} & React.DetailedHTMLProps<any,any>;

/**
 * Unified button component for Dyson UI system
 */
export const Button: React.FC<ButtonProps> = ({ impactLevel = "high", bgColor = "blue", size = "", children, disabled = false, className, ...props }) => {
	return (
		<button
			className={` px-24 text-14 text-white ${className} leading-none`}
			css={[
				buttonCSS,
				blue,
				size === "small" && smallButton,
				size === "medium" && mediumButton,
				size === "large" && largeButton,
				bgColor === "tertiary-dark" && tertiaryDark,
				bgColor === "disabled" && disabledButton,
			]}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	);
};

const buttonCSS = css`
	cursor: default;
	border-radius: 4rem;
	color: white;
	font-weight: 700;
	height: 32rem;
	span,
	div {
		font-size: 14rem;
	}
`;

const smallButton = css`
	padding: 0 12rem;
	height: 26rem;
	font-weight: 600 !important;
	font-size: 13rem;
`;

const largeButton = css`
	box-sizing: border-box;
	border: 1px solid #4675bd;
	height: 44rem;

	font-weight: 600;
	font-size: 14rem;
	width: 348px;
`;

const mediumButton = css`
	box-sizing: border-box;
	border: 1px solid #4675bd;
	height: 32rem;

	font-weight: 600;
	font-size: 14rem;
	width: 182rem;
`;

const blue = css`
	background-color: #687ef2;

	:hover {
		background-color: #6173d4;
	}
`;

const tertiaryDark = css`
	background-color: #1e242c;
	border: 1px solid #2e3744;

	:hover {
		background-color: #1b1d1f;
		border: 1px solid #2a2e38;
	}
`;

const disabledButton = css`
	background-color: #1e242c !important;
	border: 1px solid #2e3744 !important;
`;
