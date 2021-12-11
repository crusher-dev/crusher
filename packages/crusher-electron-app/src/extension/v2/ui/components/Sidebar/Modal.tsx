import React from "react";
import { css } from "@emotion/react";
import { Modal } from "@dyson/components/molecules/Modal";
import { Text, TextProps } from "@dyson/components/atoms/text/Text";
import { Input } from "@dyson/components/atoms/input/Input";
import { SearchIcon, CloseModalIcon } from "crusher-electron-app/src/extension/assets/icons";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";

const SidebarItem = ({ selected, children, ...props }: { selected?: boolean } & TextProps) => (
	<Text CSS={selected && selectedSidebarItem} {...props}>
		{children}
	</Text>
);
const ActionCard = (): JSX.Element => {
	return (
		<div>
			<div css={actionCardStyle}>
				<TextBlock className="element-action-title" css={actionTitle}>
					Element Selection
				</TextBlock>
				<TextBlock CSS={actionText}>Add new way to do things with crusher</TextBlock>
			</div>
			<div css={actionTextContainer}>
				<Text CSS={actionDesc}>By demoUser</Text>
				<Text CSS={actionDesc}>used 12k+</Text>
			</div>
		</div>
	);
};

export const ActionModal = (): JSX.Element => {
	const [visible, setVisible] = React.useState(true);
	if (!visible) return null;

	return (
		<Modal modalStyle={modalStyle}>
			<div css={sidebarStyle}>
				<SidebarItem onClick={() => 0} selected>
					All
				</SidebarItem>
				<SidebarItem>Saved Action</SidebarItem>
				<SidebarItem>Automation</SidebarItem>
				<SidebarItem>Accessibility</SidebarItem>
				<SidebarItem>Performance</SidebarItem>
				<SidebarItem>Others</SidebarItem>
			</div>
			<div css={bodyStyle}>
				<div css={flexCenter}>
					<Input rightIcon={<SearchIcon />} size="medium" placeholder="Find an action" />
					<TextBlock css={flexCenter}>
						<span>100+ actions</span>
						<span css={closeIconStyle} onClick={() => setVisible(false)}>
							<CloseModalIcon height={12} width={12} />
						</span>
					</TextBlock>
				</div>
				<div css={actionGrid}>
					<ActionCard />
					<ActionCard />
					<ActionCard />
					<ActionCard />
					<ActionCard />
					<ActionCard />
					<ActionCard />
					<ActionCard />
					<ActionCard />
				</div>
				<div css={paginationContainer}>
					<Text CSS={paginationButtonStyle}>1</Text>
					<Text CSS={paginationButtonStyle}>2</Text>
					<Text CSS={paginationButtonStyle}>3</Text>
				</div>
			</div>
		</Modal>
	);
};

const selectedSidebarItem = css`
	color: #9462ff;
`;
const actionCardStyle = css`
	padding: 8rem 12rem;
	box-sizing: border-box;
	border-radius: 4px;
	border: 1px solid #121213;
	background: #121213;
	:hover {
		border: 1px solid #9462ff;
		.element-action-title {
			color: #9462ff;
		}
	}
`;
const actionTitle = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 13px;
	color: rgba(255, 255, 255, 0.85);
	margin-bottom: 4rem;
	cursor: default;
`;
const actionText = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 12.7px;
	line-height: 20px;
	cursor: default;
	color: rgba(255, 255, 255, 0.6);
`;
const actionDesc = css`
	color: #ffffff88;
`;
const actionTextContainer = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 4rem 2rem;
`;

const paginationButtonStyle = css`
	width: 26.74px;
	height: 24px;
	box-sizing: border-box;
	border-radius: 4px;
	text-align: center;
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 12px;
	padding: 5rem 0rem;
	color: rgba(255, 255, 255, 0.85);
	background: rgba(255, 255, 255, 0.06);
	border: 1px solid transparent;
	:hover {
		border: 1px solid #ffffff;
	}
`;
const flexCenter = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const paginationContainer = css`
	display: flex;
	margin: 12rem 0rem;
	justify-content: flex-end;
	* {
		margin: 0rem 6rem;
	}
`;
const modalStyle = css`
	width: 60vw;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -20%);
	display: flex;
	padding: 0rem;
	background: linear-gradient(0deg, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.42)), #111213;
`;
const sidebarStyle = css`
	display: flex;
	flex-direction: column;
	flex: 1 0 10%;
	border-right: 1rem solid #ffffff22;
	padding: 20rem 28rem;
	* {
		padding: 6rem 0rem;
	}
`;
const closeIconStyle = css`
	margin-left: 12rem;
	path {
		fill: rgba(255, 255, 255, 0.3);
	}
	:hover {
		path {
			fill: rgba(255, 255, 255, 0.6);
		}
	}
`;
const actionGrid = css`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	column-gap: 50rem;
	row-gap: 20rem;
	margin-top: 20rem;
`;
const bodyStyle = css`
	display: flex;
	flex-direction: column;
	flex: 0 1 85%;
	padding: 20rem 28rem;
`;
