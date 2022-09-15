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
					<div css={actionDescriptionCss}>actions for element</div>
				</div>
				<PlayIconV3 css={playIconCss} />
			</div>
			<div css={actionItemContainer}>
				{children &&
					React.Children.map(children, (child: any, index) =>
						React.cloneElement(child, {
							style: { ...child.props.style},
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
	margin: 8rem 0rem;
	display: grid;
	grid-template-columns: auto auto;
	padding: 5rem 35rem;
	row-gap: 13rem;
`;
const actionItem = css`
	font-family: 'Gilroy';
	font-style: normal;
	font-weight: 400;
	font-size: 12rem;
	color: #7C7C7C;
	cursor: default;

	:hover {
		color: #fff;
	}
`;

export { ActionsList, ActionsListItem };
