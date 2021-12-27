import React from "react";
import { css } from "@emotion/react";
import { Modal } from "@dyson/components/molecules/Modal";
import { Text, TextProps } from "@dyson/components/atoms/text/Text";
import { Input } from "@dyson/components/atoms/input/Input";
import { SearchIcon, CloseModalIcon } from "crusher-electron-app/src/extension/assets/icons";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";

const SidebarItem = ({ selected, children, ...props }: { selected?: boolean } & TextProps) => (
	<Text onClick={() => 0} CSS={selected && selectedSidebarItem} {...props}>
		{children}
	</Text>
);

const ActionCard = (): JSX.Element => {
	return (
		<div css={actionCardContainer}>
			<div css={actionCardStyle}>
				<TextBlock className="element-action-title" css={actionTitle}>
					Element Selection
				</TextBlock>
				<TextBlock className="element-action-sub-title" CSS={actionText}>
					Add new way to do things with crusher
				</TextBlock>
			</div>
			<div className="element-action-stat" css={actionTextContainer}>
				<Text CSS={actionDesc}>By demoUser</Text>
				<Text CSS={actionDesc}>used 12k+</Text>
			</div>
		</div>
	);
};

const Pagination = ({ current, total, onSelect }: { onSelect: (page: number) => void }) => {
	return (
		<div css={paginationContainer}>
			{[...Array(total).keys()].map((pageNumber) => (
				<Text
					key={pageNumber.toString()}
					onClick={onSelect.bind(null, pageNumber + 1)}
					CSS={[paginationButtonStyle, current === pageNumber + 1 && selectedPage]}
				>
					{pageNumber + 1}
				</Text>
			))}
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
					<Input CSS={inputStyle} rightIcon={<SearchIcon />} size="medium" placeholder="Find an action" />
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
				<Pagination total={5} current={2} onSelect={alert} />
			</div>
		</Modal>
	);
};
const actionCardContainer = css`
	:hover {
		.element-action-stat {
			visible: visible;
			opacity: 1;
		}
	}
`;
const selectedSidebarItem = css`
	color: #9462ff;
	font-weight: 600;
`;
const actionCardStyle = css`
	padding: 8rem 12rem;
	box-sizing: border-box;
	border-radius: 4rem;
	border: 1rem solid #121213;
	background: #121213;
	:hover {
		border: 1rem solid #9462ff;
		.element-action-title {
			color: #9462ff;
		}
		.element-action-sub-title {
			color: rgba(255, 255, 255, 0.85);
		}
		.element-action-stat {
			visible: visible;
			opacity: 1;
		}
	}
`;
const actionTitle = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: 600;
	font-size: 13rem;
	color: rgba(255, 255, 255, 0.85);
	margin-bottom: 4rem;
	cursor: default;
`;
const actionText = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 11.7rem;
	line-height: 20rem;
	cursor: default;
	color: rgba(255, 255, 255, 0.6);
`;
const actionDesc = css`
	color: rgba(255, 255, 255, 0.85);
`;
const actionTextContainer = css`
	display: flex;
	visible: none;
	opacity: 0;
	justify-content: space-between;
	align-items: center;
	margin: 4rem 2rem;
`;

const paginationButtonStyle = css`
	width: 26.74rem;
	height: 24rem;
	box-sizing: border-box;
	border-radius: 4rem;
	text-align: center;
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 12rem;
	padding: 5rem 0rem;
	color: rgba(255, 255, 255, 0.85);
	background: rgba(255, 255, 255, 0.06);
	border: 1rem solid transparent;
	:hover {
		border: 1rem solid #ffffff;
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
	width: 70vw;
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
	padding: 36rem 28rem;
	* {
		margin-bottom: 20rem;
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
	row-gap: 35rem;
	margin-top: 40rem;
`;
const bodyStyle = css`
	display: flex;
	flex-direction: column;
	flex: 0 1 85%;
	padding: 26rem 28rem;
`;

const inputStyle = css`
	width: 229rem;
	height: 36rem;
`;

const selectedPage = css`
	border: 1rem solid #ffffff;
`;
