import React from "react";
import { css, SerializedStyles } from '@emotion/react';

export type ClickableProps = {

	paddingX: number;
	paddingY: number;
	/**
	 * Emotion CSS style if any
	 */
	css?: SerializedStyles;
} & React.DetailedHTMLProps<any, any>;

const ClickableLinkProps = {
	paddingY: 6,
	paddingX: 12,
	weight: 700,
};
/**
 * Crusher Clickable Text component.
 */
export const ClickableText: React.FC<ClickableProps> = (props: ClickableProps) => {
	const { paddingY, paddingX,children, css, ...otherProps } = props;
	return (
		<div
			css={[hightlLinkCSS(paddingY,paddingX),css]}
			{...otherProps}
		>
			{children}
		</div>
	);
};

ClickableText.defaultProps = ClickableLinkProps;


const hightlLinkCSS = (paddingY:number,paddingX:number) => css`
  padding: ${paddingY}rem ${paddingX}rem;

  :hover {
    background: rgba(255, 255, 255, 0.06);
  }

  border-radius: 4rem;
`