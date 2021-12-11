import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { Checkbox, CheckboxProps } from "@dyson/components/atoms/checkbox/checkbox";
import { css } from "@emotion/react";
import { MoreIcon, WarningIcon } from "crusher-electron-app/src/extension/assets/icons";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";
import { Conditional } from "@dyson/components/layouts";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { Button } from "@dyson/components/atoms/button/Button";

const steps = [
	{ id: "test4", title: "Click on element", isRunning: true },
	{ id: "test2", title: "Click on element" },
	{ id: "test1", title: "Click on element", isFailed: true },
	{ id: "test3", title: "Click on element" },
	{ id: "test5", title: "Click on element" },
];

export function Steps(): JSX.Element {
	const [selected, setSelected] = React.useState(new Set());

	const toggleAllSteps = React.useCallback(
		(checked) => {
			if (checked) {
				setSelected(new Set([...steps.map((step) => step.id)]));
			} else {
				setSelected(new Set());
			}
		},
		[selected.size],
	);

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
		<div css={container}>
			<div css={stepsHeaderStyle}>
				<Checkbox isSelected={steps.length === selected.size} callback={toggleAllSteps} />
				<Text CSS={stepsText}>{steps.length} Steps</Text>
				<Conditional showIf={!!selected.size}>
					<div css={stepDropdown}>
						<Dropdown
							dropdownCSS={dropdownCSS}
							component={
								<>
									<TextBlock css={dropdownItemText}>Create template</TextBlock>
									<TextBlock css={dropdownItemText}>Create template</TextBlock>
									<TextBlock css={dropdownItemText}>Create template</TextBlock>
								</>
							}
						>
							<MoreIcon />
						</Dropdown>
					</div>
				</Conditional>
			</div>
			<div className="custom-scroll" css={stepsContainer}>
				{steps.map((step) => (
					<Step
						isSelectAllType={false}
						key={step.id}
						isRunning={step.isRunning}
						isFailed={step.isFailed}
						isSelected={selected.has(step.id)}
						callback={() => toggleStep(step.id)}
						title={step.title}
						subtitle="p > a"
					/>
				))}
			</div>
		</div>
	);
}

function Step({
	title,
	subtitle,
	isRunning,
	isFailed,
	...props
}: CheckboxProps & { title: string; subtitle: string; isRunning?: boolean; isFailed?: boolean }): JSX.Element {
	return (
		<div>
			<div css={[stepStyle, isRunning && runningStepStyle, isFailed && failedStyle]}>
				<Checkbox {...props} />
				<div css={stepText}>
					<TextBlock css={stepTitle}>{title}</TextBlock>
					<TextBlock css={stepSubtitle}>{subtitle}</TextBlock>
				</div>
				<MoreIcon />
				<Conditional showIf={isFailed}>
					<TextBlock CSS={stepWarning}>
						<WarningIcon /> This step failed
					</TextBlock>
				</Conditional>
			</div>

			<Conditional showIf={isFailed}>
				<div css={failedToDO}>
					<div css={failedToDoHead}>
						<Text CSS={whatTODO}>What to do?</Text>
						<MoreIcon />
					</div>
					<Button CSS={failedButton} bgColor="tertiary-outline">
						<Text color="#40383b">Mark optional</Text>
					</Button>
					<Button CSS={failedButton} bgColor="tertiary-outline">
						<Text color="#40383b">Delete & continue</Text>
					</Button>
				</div>
			</Conditional>
		</div>
	);
}
const container = css`
	border-top: 1rem solid #303235;
`;
const stepsHeaderStyle = css`
	display: flex;
	align-items: center;
	padding: 14rem 26rem;
`;
const stepsText = css`
	font-family: Cera Pro;
	font-size: 15px;
	flex-grow: 1;
	margin: 0rem 8rem;
`;
const stepDropdown = css`
	box-sizing: border-box;
	position: relative;
	display: block;
`;
const dropdownCSS = css`
	width: 160rem;
	transform: translate(-80%, -40%);
`;
const dropdownItemText = css`
	padding: 6rem 16rem;
`;
const stepsContainer = css`
	overflow-y: auto;
	padding: 18rem 22rem;
	padding-top: 0rem;
	height: 35vh;
`;
const runningStepStyle = css`
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-bottom: 4rem solid #a6ba86;
`;
const stepStyle = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	box-sizing: border-box;
	border-radius: 6px;
	padding: 3rem 12rem;
	margin: 10rem 0rem;
`;

const failedStyle = css`
	border: 1px solid rgba(255, 255, 255, 0.12);
	background: #0f1011;
`;
const stepText = css`
	margin: 5rem;
	padding: 4rem;
	flex: 1 0 50%;
`;
const stepTitle = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 12px;
	line-height: 13px;
`;
const stepSubtitle = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 10px;
	line-height: 10px;
`;
const stepWarning = css`
	display: block;
	flex: 0 1 100%;
	font-family: Gilroy;
	font-style: normal;
	font-weight: 400;
	font-size: 13px;
	line-height: 13px;
	color: #de3d76;
	padding: 6rem;
`;
const failedToDO = css`
	padding: 10rem 12rem;
	margin: 6rem 0rem;
	background: #0f1011;
	border: 1px solid rgba(255, 255, 255, 0.12);
	box-sizing: border-box;
	border-radius: 4px;
`;
const failedToDoHead = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8rem;
`;
const whatTODO = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 12px;
	line-height: 13px;
	/* or 108% */

	color: #ffffff;
`;
const failedButton = css`
	background: white;
	margin-right: 8rem;
`;
