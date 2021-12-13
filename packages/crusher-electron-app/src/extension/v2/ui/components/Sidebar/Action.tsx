import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { css } from "@emotion/react";
import { ActionList, ActionListItem } from "./ActionList";

export const Action = ({ setSelected }): JSX.Element => {
	return (
		<div>
			<ActionList>
				<div css={actionTab}>
					<Text onClick={() => setSelected(true)} css={actionTabSelected}>
						Click
					</Text>
					<Text CSS={hoverTextStyle} onClick={() => 0}>
						Hover
					</Text>
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
	);
};

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
const hoverTextStyle = css`
	:hover {
		background-color: #32363678;
	}
`;
