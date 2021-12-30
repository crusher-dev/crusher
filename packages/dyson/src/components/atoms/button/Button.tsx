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
} & React.DetailedHTMLProps<any, any>;

/*
	Note :- Change color and size thru switch statement
 */
/**
 * Unified button component for Dyson UI system
 */
export const Button: React.FC<ButtonProps> = ({ bgColor = "blue", size = "", children, disabled = false, className, ...props }) => (
	<button
		className={` rem-24 text-14 text-white ${className} leading-none`}
		css={[
			buttonCSS,
			blue,
			size === "x-small" && extraSmallButton,
			size === "small" && smallButton,
			size === "medium" && mediumButton,
			size === "large" && largeButton,
			bgColor === "tertiary-dark" && tertiaryDark,
			bgColor === "tertiary-outline" && tertiaryOutline,
			bgColor === "danger" && danger,
			bgColor === "disabled" && disabledButton,
		]}
		disabled={disabled}
		{...props}
	>
		{children}
	</button>
);

const buttonCSS = css`
	cursor: default;
	border-radius: 4rem;
	color: white;
	font-weight: 700;
	height: 32rem;
	padding: 0 12rem;
	span,
	div {
		font-size: 14rem;
	}
`;

const extraSmallButton = css`
	padding: 0 12rem;
	height: 24rem;
	font-weight: 600 !important;
	font-size: 12.5rem;
`;

const smallButton = css`
	padding: 0 12rem;
	height: 28rem;
	font-weight: 600 !important;
	font-size: 13rem;
`;

const largeButton = css`
	box-sizing: border-box;
	border: 1rem solid #4675bd;
	height: 44rem;

	font-weight: 600;
	font-size: 14rem;
	width: 348rem;
`;

const mediumButton = css`
	box-sizing: border-box;
	border: 1rem solid #4675bd;
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

const danger = css`
	background-color: #aa3e5f;

	:hover {
		background-color: #c0486d;
	}
`;

const tertiaryDark = css`
	background-color: #1e242c;
	border: 1rem solid #2e3744;

	:hover {
		background-color: #1b1d1f;
		border: 1rem solid #2a2e38;
	}
`;

const tertiaryOutline = css`
	border: 1rem solid #2e3744;
	background: rgba(255, 255, 255, 0);

	:hover {
		background: rgba(255, 255, 255, 0.05);
		border: 1rem solid #2a2e38;
	}
`;

const disabledButton = css`
	background-color: #1e242c !important;
	border: 1rem solid #2e3744 !important;
`;
