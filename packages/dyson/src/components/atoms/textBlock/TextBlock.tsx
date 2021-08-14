import React from "react";
import { css } from '@emotion/react';

export type TextBlockProps = {
	fontSize: string,
	leading: boolean,
	weight: number,
	color: string
}  & React.DetailedHTMLProps<any, any>;

const TextDefaultProps = {
	fontSize: 12,
	leading: false,
	weight: 700,
	color: "#fff"
};
/**
 * Crusher Text component.
 */
export const TextBlock: React.FC<TextBlockProps> = (props: TextBlockProps) => {
	const {type, children, fontSize, leading ,weight, color,className, ...otherProps} = props;
	return (
			<div className={`font-gilroy font-${weight} ${className}`} css={css`
font-size: ${fontSize}rem; color: ${color};`} {...otherProps}>
				{children}
			</div>
	);
};

TextBlock.defaultProps = TextDefaultProps;
