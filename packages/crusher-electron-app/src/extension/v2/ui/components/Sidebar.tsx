import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { Checkbox } from "@dyson/components/atoms/checkbox/checkbox";
import { css } from "@emotion/react";
import { SearchIcon } from "crusher-electron-app/src/extension/assets/icons";
import { ActionList, ActionListItem } from "./ActionList";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";

const containerStyle = css`
	padding: 26rem;
`;
const Sidebar = (): JSX.Element => {
	return (
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
			</ActionList>
			<Step />
		</div>
	);
};

export default Sidebar;

function Step() {
	const [s, setS] = React.useState(false);
	return (
		<div>
			<div
				css={css`
					display: flex;
					align-items: center;
				`}
			>
				<Checkbox isSelected={s} callback={(a) => setS(a)} />
				<div>
					<TextBlock>Click on Element</TextBlock>
					<TextBlock>{"p > a"}</TextBlock>
				</div>
			</div>
		</div>
	);
}
