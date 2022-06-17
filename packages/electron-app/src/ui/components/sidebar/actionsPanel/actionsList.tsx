import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { css } from "@emotion/react";
import { Conditional } from "@dyson/components/layouts";

interface IActionsListProps {
	children?: any;
	className?: string;
	title?: string;
}

const ActionsList = ({
	children,
	title,
	className,
	...props
}: {
	title?: string;
	children: React.ReactChild | React.ReactChild[];
	className?: any;
}): JSX.Element => {
	return (
		<div css={containerStyle} className={`${className}`} {...props}>
			<Conditional showIf={!!title}>
				<Text css={titleStyle}>{title}</Text>
			</Conditional>
			<div css={actionItemContainer}>
				{children &&
					React.Children.map(children, (child: any, index) =>
						React.cloneElement(child, {
							style: { ...child.props.style, borderBottom: index < (children as any).length - 1 ? "1rem solid #323636" : "none" },
						}),
					)}
			</div>
		</div>
	);
};

const ActionsListItem: React.FC = ({ children, className, ...props }: any) => {
	return (
		<div css={actionItem} className={`${className}`} {...props}>
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
	font-size: 14rem;
	line-height: 18rem;
`;
const moreStyle = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 13rem;
	line-height: 15rem;
	margin-left: 8rem;
	color: #af71ff;
`;
const actionItemContainer = css`
	border: 1rem solid #292929;
	margin: 8rem 0rem;
	border-radius: 8rem;
	background: #161818;
`;
const actionItem = css`
	padding: 10rem 14rem 9rem 16rem;
	font-family: Gilroy;
	font-size: 13rem;

	cursor: default;
	:hover {
		background-color: #32363678;
	}
`;

export { ActionsList, ActionsListItem };
