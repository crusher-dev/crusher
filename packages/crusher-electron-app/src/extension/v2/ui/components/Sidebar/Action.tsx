import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { css } from "@emotion/react";
import { SearchIcon } from "crusher-electron-app/src/extension/assets/icons";
import { ActionList, ActionListItem } from "./ActionList";

const containerStyle = css`
	padding: 26rem;
	height: 55vh;
	overflow-y: auto;
`;

export const Action = (): JSX.Element => (
	<div css={containerStyle}>
		<div
			css={css`
				display: flex;
				justify-content: space-between;
			`}
		>
			<Text
				CSS={css`
					font-family: Cera Pro;
					font-size: 15px;
				`}
			>
				Actions
			</Text>
			<SearchIcon />
		</div>
		<div css={css``}>
			<ActionList>
				<div
					css={css`
						display: flex;
						justify-content: stretch;
						* {
							padding: 8rem 4rem;
							font-family: Gilroy;
							font-size: 13px;
							text-align: center;
							flex: 1;
						}
					`}
				>
					<Text
						css={css`
							background: rgba(148, 98, 255, 0.63);
						`}
					>
						Click
					</Text>
					<Text CSS={css``}>Hover</Text>
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
