import React from "react";

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
	className?: string;
}

/**
 * Unified button component for Dyson UI system
 */
export const Button: React.FC<ButtonProps> = ({ type = "primary", bgColor = "blue", size = "medium", children, className, ...props }) => {
	return (
		<button className={`py-10 px-60 text-14 text-white ${className}`} style={buttonCSS} {...props} >
			{children}
		</button>
	);
};


const buttonCSS: React.CSSProperties = {
	backgroundColor: "#687EF2",
	borderRadius: "4rem",
	color: "white",
	fontWeight: 700,
}