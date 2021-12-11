import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { css } from "@emotion/react";
import { SearchIcon } from "crusher-electron-app/src/extension/assets/icons";
import { ActionList, ActionListItem } from "./ActionList";

const containerStyle = css``;

export const Action = (): JSX.Element => {
	const [selected, setSelected] = React.useState(false);
	if (selected)
		return (
			<div
				css={css`
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					height: calc(50vh + 80rem);
				`}
			>
				<Text
					CSS={css`
						font-family: Cera Pro;
						font-style: normal;
						font-weight: normal;
						font-size: 15px;
						line-height: 19px;
						margin-bottom: 10rem;
					`}
				>
					Action required element selection
				</Text>
				<Text
					CSS={css`
						font-family: Gilroy;
						font-style: normal;
						font-weight: normal;
						font-size: 15px;
						line-height: 17px;
						margin-bottom: 26rem;
					`}
				>
					Select an element on left side
				</Text>
				<Text
					onClick={() => setSelected(false)}
					CSS={css`
						font-family: Cera Pro;
						font-style: normal;
						font-weight: normal;
						font-size: 13px;
						line-height: 16px;
						text-decoration-line: underline;
					`}
				>
					Cancel action
				</Text>
			</div>
		);

	return (
		<div css={containerStyle}>
			<div
				css={css`
					display: flex;
					padding: 18rem 26rem;
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
			<div
				className="custom-scroll"
				css={css`
					padding: 26rem;
					padding-top: 0rem;
					height: 50vh;
					overflow-y: auto;
				`}
			>
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
							onClick={() => setSelected(true)}
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
};
