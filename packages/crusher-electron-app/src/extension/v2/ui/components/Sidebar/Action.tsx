import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { css } from "@emotion/react";
import { SearchIcon } from "crusher-electron-app/src/extension/assets/icons";
import { ActionList, ActionListItem } from "./ActionList";

export const Action = (): JSX.Element => {
	const [selected, setSelected] = React.useState(false);
	if (selected)
		return (
			<div css={selectActionContainer}>
				<Text CSS={selectActionHeading}>Action required element selection</Text>
				<Text CSS={selecteActionText}>Select an element on left side</Text>
				<Text onClick={() => setSelected(false)} CSS={selectActionCancel}>
					Cancel action
				</Text>
			</div>
		);

	return (
		<div css={containerStyle}>
			<div css={headerContainer}>
				<Text CSS={headerText}>Actions</Text>
				<SearchIcon />
			</div>
			<div className="custom-scroll" css={actionListContainer}>
				<ActionList>
					<div css={actionTab}>
						<Text onClick={() => setSelected(true)} css={actionTabSelected}>
							Click
						</Text>
						<Text onClick={() => 0}>Hover</Text>
					</div>
					<ActionListItem>Click on element</ActionListItem>
					<ActionListItem>Click on element</ActionListItem>
					<ActionListItem>Click on element</ActionListItem>
				</ActionList>
				<ActionList title="Page List">
					<ActionListItem>Click on element</ActionListItem>
					<ActionListItem>Click on element</ActionListItem>
					<ActionListItem>Click on element</ActionListItem>
				</ActionList>
				<ActionList title="Most Used">
					<ActionListItem>Click on element</ActionListItem>
					<ActionListItem>Click on element</ActionListItem>
				</ActionList>
			</div>
		</div>
	);
};

const containerStyle = css``;

const selectActionContainer = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: calc(50vh + 80rem);
`;
const selectActionHeading = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: normal;
	font-size: 15px;
	line-height: 19px;
	margin-bottom: 10rem;
`;
const selecteActionText = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 15px;
	line-height: 17px;
	margin-bottom: 26rem;
`;
const selectActionCancel = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: normal;
	font-size: 13px;
	line-height: 16px;
	text-decoration-line: underline;
`;
const headerContainer = css`
	display: flex;
	padding: 18rem 26rem;
	justify-content: space-between;
`;
const headerText = css`
	font-family: Cera Pro;
	font-size: 15px;
`;
const actionListContainer = css`
	padding: 26rem;
	padding-top: 0rem;
	height: 50vh;
	overflow-y: auto;
`;
const actionTab = css`
	display: flex;
	justify-content: stretch;
	* {
		padding: 8rem 4rem;
		font-family: Gilroy;
		font-size: 13px;
		text-align: center;
		flex: 1;
	}
`;
const actionTabSelected = css`
	background: rgba(148, 98, 255, 0.63);
`;
