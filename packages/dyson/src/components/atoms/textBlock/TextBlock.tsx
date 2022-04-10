import React from "react";
import { css, SerializedStyles } from "@emotion/react";

export type TextBlockProps = {
	fontSize: string;
	showLineHeight: boolean;
	weight: number;
	letterSpacing?: boolean;
	color: string;
} & React.DetailedHTMLProps<any, any>;

const TextDefaultProps = {
	fontSize: 12,
	showLineHeight: false,
	weight: 400,
	color: "#fff",
};

const getLetterSpacing = (fontSize)=>{
	if(fontSize < 12){
		return {letterSpacing: `.4px`}
	}

	if(fontSize < 13){
		return {letterSpacing: `.35px`}
	}

	if(fontSize < 14){
		return {letterSpacing: `.3px`}
	}
	if(fontSize <= 15){
		return {letterSpacing: `.25px`}
	}

	return {letterSpacing: `0`}
}
/**
 * Crusher Text component.
 */
export const TextBlock: React.FC<TextBlockProps> = (props: TextBlockProps) => {
	const { children, fontSize, weight, color, className,letterSpacing, showLineHeight, ...otherProps } = props;
	return (
		<div
			className={`font-gilroy font-${weight} ${className}`}
			css={css`
				font-size: ${fontSize}rem;
				color: ${color};
				${showLineHeight === false ? "line-height: 1;" : "line-height: 1.6;"}
				letter-spacing: ${!!letterSpacing ? getLetterSpacing(fontSize) : '0'}
			`}
			{...otherProps}
		>
			{children}
		</div>
	);
};

TextBlock.defaultProps = TextDefaultProps;
