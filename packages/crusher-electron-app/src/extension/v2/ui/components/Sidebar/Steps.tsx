import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { Checkbox, CheckboxProps } from "@dyson/components/atoms/checkbox/checkbox";
import { css } from "@emotion/react";
import { MoreIcon } from "crusher-electron-app/src/extension/assets/icons";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";
import { Conditional } from "@dyson/components/layouts";
import { Dropdown } from "@dyson/components/molecules/Dropdown";

export const containerStyle = css`
	padding: 26rem;
`;

export function Steps(): JSX.Element {
	const [s, setS] = React.useState([]);
	const [selected, setSelected] = React.useState(new Set());

	const toggleStep = React.useCallback(
		(index) => {
			const selectedSteps = new Set(selected);
			console.log(selected);
			if (selected.has(index)) {
				selectedSteps.delete(index);
			} else {
				selectedSteps.add(index);
			}

			setSelected(selectedSteps);
		},
		[selected],
	);

	return (
		<div
			css={css`
				border-top: 1rem solid #303235;
			`}
		>
			<div
				css={css`
					display: flex;
					align-items: center;
					padding: 14rem 26rem;
				`}
			>
				<Checkbox isSelected={!!s.length} callback={(a) => setS([a])} />

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
				<Conditional showIf={!!selected.size}>
					<div
						css={css`
							box-sizing: border-box;
							position: relative;
							display: block;
						`}
					>
						<Dropdown
							dropdownCSS={css`
								width: 160rem;
								transform: translate(-80%, -40%);
							`}
							component={
								<>
									<TextBlock
										css={css`
											padding: 6rem 16rem;
										`}
									>
										Create template
									</TextBlock>
								</>
							}
						>
							<MoreIcon />
						</Dropdown>
					</div>
				</Conditional>
			</div>
			<div
				css={css`
					overflow-y: auto;
					padding: 18rem 26rem;
					padding-top: 0rem;
					height: 25vh;
				`}
			>
				{[...Array(6)].map((e, i) => (
					<Step
						isSelectAllType={false}
						key={i}
						isSelected={selected.has(i)}
						callback={() => toggleStep(i)}
						title="Click on Element"
						subtitle="p > a"
					/>
				))}
			</div>
		</div>
	);
}

function Step({ title, subtitle, ...props }: CheckboxProps & { title: string; subtitle: string }): JSX.Element {
	return (
		<div
			css={css`
				display: flex;
				align-items: center;
			`}
		>
			<Checkbox {...props} />
			<div
				css={css`
					margin: 5rem;
					padding: 4rem;
				`}
			>
				<TextBlock>{title}</TextBlock>
				<TextBlock>{subtitle}</TextBlock>
			</div>
		</div>
	);
}
