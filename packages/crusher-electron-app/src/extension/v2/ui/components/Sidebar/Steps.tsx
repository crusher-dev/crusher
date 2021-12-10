import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { Checkbox } from "@dyson/components/atoms/checkbox/checkbox";
import { css } from "@emotion/react";
import { SearchIcon, MoreIcon } from "crusher-electron-app/src/extension/assets/icons";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";

export const containerStyle = css`
	padding: 26rem;
`;

export function Steps(): JSX.Element {
	const [s, setS] = React.useState(false);
	return (
		<div
			css={css`
				border-top: 1rem solid #303235;
				padding: 18rem 26rem;
			`}
		>
			<div
				css={css`
					display: flex;
					align-items: center;
					margin-bottom: 5rem;
				`}
			>
				<Checkbox isSelected={s} callback={(a) => setS(a)} />

				<Text
					CSS={css`
						font-family: Cera Pro;
						font-size: 15px;
						flex-grow: 1;
						margin: 0rem 8rem;
					`}
				>
					11 Steps
				</Text>
				<MoreIcon />
			</div>
			<Step s={s} setS={setS} />
			<Step s={s} setS={setS} />
			<Step s={s} setS={setS} />
		</div>
	);
}
function Step(s: boolean, setS: React.Dispatch<React.SetStateAction<boolean>>): JSX.Element {
	return (
		<div
			css={css`
				display: flex;
				align-items: center;
			`}
		>
			<Checkbox isSelected={s} callback={(a) => setS(a)} />
			<div
				css={css`
					margin: 5rem;
					padding: 4rem;
				`}
			>
				<TextBlock>Click on Element</TextBlock>
				<TextBlock>{"p > a"}</TextBlock>
			</div>
		</div>
	);
}
