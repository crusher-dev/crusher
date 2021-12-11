import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { css } from "@emotion/react";
import { Conditional } from "@dyson/components/layouts";

export const ActionList = ({ children, title }: { title?: string; children: React.ReactChild | React.ReactChild[] }): JSX.Element => {
	return (
		<div css={containerStyle}>
			<Conditional showIf={!!title}>
				<Text CSS={titleStyle}>{title}</Text>
				<Text CSS={moreStyle} onClick={() => 0}>
					more
				</Text>
			</Conditional>
			<div css={actionItemContainer}>{children}</div>
		</div>
	);
};

export const ActionListItem: React.FC = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div css={actionItem} {...props}>
			{children}
		</div>
	);
};

const containerStyle = css`
	padding: 10rem 0rem;
`;
const titleStyle = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: normal;
	font-size: 14px;
	line-height: 18px;
`;
const moreStyle = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 13px;
	line-height: 15px;
	margin-left: 8rem;
	color: #af71ff;
`;
const actionItemContainer = css`
	border: 1px solid #323636;
	margin: 8rem 0rem;
	border-radius: 8rem;
`;
const actionItem = css`
	padding: 8rem 16rem;
	font-family: Gilroy;
	font-size: 13px;
	line-height: 15px;
	border: 1px solid #323636;
	cursor: default;
	:hover {
		background-color: #32363678;
	}
`;
