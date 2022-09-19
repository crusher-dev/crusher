import React from "react";
import { css, SerializedStyles } from "@emotion/react";

export type ClickableProps = {
	type: 'box' | 'plain';
	useATag: false;
	paddingX: number;
	paddingY: number;
	external?: boolean;
	underline?: boolean;
	/**
	 * Emotion CSS style if any
	 */
	css?: SerializedStyles;
} & React.DetailedHTMLProps<any, any>;

const LinkBlockProps = {
	paddingY: 6,
	paddingX: 12,
	weight: 500,
};
/**
 * Crusher Link Block component.
 */
export const LinkBlock: React.FC<ClickableProps> = (props: ClickableProps) => {
	const { paddingY, paddingX, children, css, ...otherProps } = props;
	return (
		<div css={[hightlLinkCSS(paddingY, paddingX), css]} {...otherProps}>
			{children}
		</div>
	);
};

LinkBlock.defaultProps = LinkBlockProps;

const hightlLinkCSS = (paddingY: number, paddingX: number) => css`
	padding: ${paddingY}rem ${paddingX}rem;

	:hover {
		background: rgba(255, 255, 255, 0.06);
	}

	border-radius: 4rem;
`;
