import React from "react";
import { css, SerializedStyles } from "@emotion/react";
import { Conditional } from "../../layouts";

export type ClickableProps = {
	type: 'box' | 'plain';
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
	type: 'box',
	paddingY: 6,
	paddingX: 12,
	weight: 500,
};
/**
 * Crusher Link Block component.
 */
export const LinkBlock: React.FC<ClickableProps> = (props: ClickableProps) => {
	const { paddingY, paddingX, children, css, external, type, href, ...otherProps } = props;
	const base = (
		<div css={[hightlLinkCSS(paddingY, paddingX), typeCSS(type), css]} {...otherProps}>
			{children}
			<Conditional showIf={external}>
				<ExternalIcon height={8} width={8} />
			</Conditional>
		</div>
	);

	if (!href) return base

	const { target = "_blank" } = props
	return (<a href={href} target={target}>
		{base}
	</a>)
};

LinkBlock.defaultProps = LinkBlockProps;

const hightlLinkCSS = (paddingY: number, paddingX: number) => css`
	padding: ${paddingY}rem ${paddingX}rem;


`;

const typeCSS = (type) => css`
display: flex;
align-items:center;
gap: 4rem;
	${type === "box" && (
		`
	:hover {
		background: rgba(255, 255, 255, 0.06);
	}

	border-radius: 4rem;
	`
	)}

	${type === "plain" && (
		`
	:hover {
		color: #b351ff;
		path{
			fill:  #b351ff;
		}
		text-decoration: underline;
	}

	border-radius: 4rem;
	`
	)}

`


const ExternalIcon = (props) => (
	<svg
		viewBox={"0 0 8 8"}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M7.154.18c.24.215.259.584.043.823L1.503 7.178c-.215.24-.76.216-1 0-.239-.215-.215-.76 0-1L6.33.223a.583.583 0 0 1 .824-.044Z"
			fill="#3C3C3D"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M.356.949A.583.583 0 0 1 .908.336L6.733.03a.583.583 0 0 1 .613.552l.305 5.826a.583.583 0 1 1-1.165.06l-.274-5.242-5.243.275A.583.583 0 0 1 .356.949Z"
			fill="#3C3C3D"
		/>
	</svg>
)
