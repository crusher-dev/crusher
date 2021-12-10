import React from "react";
import { css, SerializedStyles } from "@emotion/react";

export type TextProps = {
	/**
	 * Emotion CSS style if any
	 */
	fontSize?: number;
	leading?: boolean;
	weight?: number;
	CSS?: SerializedStyles;
	color?: string;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, any>;

const TextDefaultProps = {
	fontSize: 12,
	leading: false,
	weight: 700,
	color: "#fff",
};
/**
 * Crusher Text component.
 */
export const Text: React.FC<TextProps> = (props: TextProps) => {
	const { children, fontSize, weight, className, color, ...otherProps } = props;
	return (
		<span
			className={`font-gilroy font-${weight} ${className}`}
			css={[
				css`
					font-size: ${fontSize}rem;
					color: ${color};
					${otherProps.onClick && `cursor:default`}
				`,
				otherProps.CSS,
			]}
			{...otherProps}
		>
			{children}
		</span>
	);
};

Text.defaultProps = TextDefaultProps;
