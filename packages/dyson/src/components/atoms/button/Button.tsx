import React from "react";
import {css} from "@emotion/react"
const button = css`
	font-size: 16rem;
	border: 3px solid red;
`

export interface ButtonProps {
	/**
	 * Is this the principal call to action on the page?
	 */
	type?: "primary" | "secondary" | "tertiary";
	/**
	 * What background color to use
	 */
	bgColor?: "blue" | "pink" | "green" | "tertiary-strong" | "tertiary-medium" | "tertiary-light";
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
	css?: [string] | string;
	/**
	 * Button contents
	 */
	children: string;
	/**
	 * Optional click handler
	 */
	onClick?: () => void;
}

/**
 * Unified button component for Dyson UI system
 */
export const Button: React.FC<ButtonProps> = ({ type = "primary", bgColor = "blue", size = "medium", children, ...props }) => {
	return (
		<button css={button} className="py-10 px-60 text-14 text-white" {...props}>
			{children}
		</button>
	);
};


const buttonCSS = css`
   background-color:#687EF2;
`