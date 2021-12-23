import React from "react";
import { css } from "@emotion/react";

export type TextBlockProps = {
	fontSize: string;
	showLineHeight: boolean;
	weight: number;
	color: string;
} & React.DetailedHTMLProps<any, any>;

const TextDefaultProps = {
	fontSize: 12,
	showLineHeight: false,
	weight: 400,
	color: "#fff",
};
/**
 * Crusher Text component.
 */
export const TextBlock: React.FC<TextBlockProps> = (props: TextBlockProps) => {
	const { children, fontSize, weight, color, className, showLineHeight, ...otherProps } = props;
	return (
		<div
			className={`font-gilroy font-${weight} ${className}`}
			css={css`
				font-size: ${fontSize}rem;
				color: ${color};
				${showLineHeight === false ? "line-height: 1;" : ""}
			`}
			{...otherProps}
		>
			{children}
		</div>
	);
};

TextBlock.defaultProps = TextDefaultProps;
