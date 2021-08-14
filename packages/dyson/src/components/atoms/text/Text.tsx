import React from "react";
import { css } from '@emotion/react';

export type TextProps = {
	/**
	 * Emotion CSS style if any
	 */
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
export const Text: React.FC<TextProps> = (props: TextProps) => {
	const {type, children, fontSize, leading ,weight, className, color, ...otherProps} = props;
	return (
			<span className={`font-gilroy font-${weight} ${className}`} css={css`
font-size: ${fontSize}rem; color: ${color};`} {...otherProps}>
				{children}
			</span>
	);
};

Text.defaultProps = TextDefaultProps;
