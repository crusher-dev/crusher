import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { css } from "@emotion/react";
import { Conditional } from "@dyson/components/layouts";

export const ActionList = ({ children, title }: { title?: string; children: React.ReactChild | React.ReactChild[] }): JSX.Element => {
	return (
		<div
			css={css`
				margin: 20rem 0rem;
			`}
		>
			<Conditional showIf={!!title}>
				<Text
					CSS={css`
						font-family: Cera Pro;
						font-style: normal;
						font-weight: normal;
						font-size: 14px;
						line-height: 18px;
					`}
				>
					{title}
				</Text>
			</Conditional>
			<div
				css={css`
					border: 1px solid #323636;
					margin: 8rem 0rem;
					border-radius: 8rem;
				`}
			>
				{children}
			</div>
		</div>
	);
};
export const ActionListItem: React.FC = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			css={css`
				padding: 8rem 16rem;
				font-family: Gilroy;
				font-size: 13px;
				line-height: 15px;
				border: 1px solid #323636;
				cursor: default;
				:hover {
					background-color: #32363678;
				}
			`}
			{...props}
		>
			{children}
		</div>
	);
};
