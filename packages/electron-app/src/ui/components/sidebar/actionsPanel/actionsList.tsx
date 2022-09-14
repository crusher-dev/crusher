import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { css } from "@emotion/react";
import { Conditional } from "@dyson/components/layouts";
import { ActionHeadingIcon, PlayIconV3 } from "electron-app/src/ui/icons";

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
			{/* <Conditional showIf={!!title}>
				<Text css={titleStyle}>{title}</Text>
			</Conditional> */}
			<div css={headingBoxCss}>
				<ActionHeadingIcon  css={css`width: 12rem; height: 12rem; margin-top: 1rem; margin-left: -0.5rem; `} />
				<div css={css`margin-left: 8.5rem; display: flex; flex: 1; flex-direction: column;`}>
					<div css={actionTitleCss}>{title}</div>
					<div css={actionDescriptionCss}>action for element</div>
				</div>
				<PlayIconV3 css={playIconCss} />
			</div>
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

const actionTitleCss =  css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: 500;
	font-size: 14rem;
	color: #FFFFFF;
`;

const actionDescriptionCss = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: 400;
	font-size: 10rem;

	color: #A6A6A6;
	margin-top: 2.25rem;
`;
const playIconCss = css`
	width: 6rem;
	height: 8rem;
	margin-left: auto;
	margin-right: 5rem;
	margin-top: 3rem;
	:hover {
		opacity: 0.8;
	}
`;
const headingBoxCss = css`
	background: linear-gradient(0deg, rgba(48, 60, 102, 0.42), rgba(48, 60, 102, 0.42)), #09090A;
    padding: 7rem 15rem;
	display: flex;
`;

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
