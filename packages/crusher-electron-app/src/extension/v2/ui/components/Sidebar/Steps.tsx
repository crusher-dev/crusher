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
	const [checkedSteps, setCheckedSteps] = React.useState(new Set());

	const toggleAllSteps = React.useCallback(
		(checked) => {
			if (checked) {
				setCheckedSteps(new Set([...steps.map((step) => step.id)]));
			} else {
				setCheckedSteps(new Set());
			}
		},
		[checkedSteps.size],
	);

	const toggleStep = React.useCallback(
		(index) => {
			const selectedSteps = new Set(checkedSteps);
			console.log(checkedSteps);
			if (checkedSteps.has(index)) {
				selectedSteps.delete(index);
			} else {
				selectedSteps.add(index);
			}

			setCheckedSteps(selectedSteps);
		},
		[checkedSteps],
	);

	return (
		<div css={container}>
			<div css={stepsHeaderStyle}>
				<Checkbox isSelected={steps.length === checkedSteps.size} callback={toggleAllSteps} />
				<Text CSS={stepsText}>{steps.length} Steps</Text>
				<Conditional showIf={!!checkedSteps.size}>
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
						isSelected={checkedSteps.has(step.id)}
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
					<TextBlock css={stepTitle} CSS={isFailed && failedStepTitle}>
						{title}
					</TextBlock>
					<TextBlock css={stepSubtitle}>{subtitle}</TextBlock>
				</div>
				<Conditional showIf={isFailed}>
					<MoreIcon />
					<TextBlock CSS={stepWarning}>
						<WarningIcon /> &nbsp; This step failed
					</TextBlock>
				</Conditional>
			</div>

			<Conditional showIf={isFailed}>
				<div css={failedToDO}>
					<div css={failedToDoHead}>
						<Text CSS={whatTODO}>What to do?</Text>
						<MoreIcon />
					</div>
					<div css={failedButtons}>
						<Button size="small" CSS={failedButton} bgColor="tertiary-outline">
							Mark optional
						</Button>
						<Button size="small" CSS={failedButton} bgColor="tertiary-outline">
							Delete & continue
						</Button>
					</div>
				</div>
			</Conditional>
		</div>
	);
}
const failedStepTitle = css`
	font-weight: 800;
`;
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
	font-size: 15rem;
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
	height: 32vh;
`;
const runningStepStyle = css`
	border: 1rem solid rgba(255, 255, 255, 0.1);
	border-bottom: 4rem solid #a6ba86;
`;
const stepStyle = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	box-sizing: border-box;
	border-radius: 6rem;
	padding: 3rem 12rem;
	margin: 10rem 0rem;
`;

const failedStyle = css`
	border: 1rem solid rgba(255, 255, 255, 0.12);
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
	font-size: 12rem;
	line-height: 13rem;
`;
const stepSubtitle = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 10rem;
	line-height: 10rem;
`;
const stepWarning = css`
	display: block;
	flex: 0 1 100%;
	font-family: Gilroy;
	font-style: normal;
	font-weight: 600;
	font-size: 13rem;
	line-height: 13rem;
	color: #de3d76;
	padding: 6rem;
	padding-bottom: 20rem;
`;
const failedToDO = css`
	padding: 15rem;
	margin: 6rem 0rem;
	background: #0f1011;
	border: 1rem solid rgba(255, 255, 255, 0.12);
	box-sizing: border-box;
	border-radius: 4rem;
`;
const failedButtons = css`
	display: flex;
`;
const failedToDoHead = css`
	display: flex;
	flex: 1 1 100%;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8rem;
`;
const whatTODO = css`
	font-family: Gilroy;
	font-weight: 800;
	font-size: 12rem;
`;
const failedButton = css`
	margin-right: 9rem;
	background: #ffffff;
	border-radius: 4rem;
	font-size: 12rem !important;
	color: #40383b;
	:hover {
		background: rgba(255, 255, 255, 0.8);
	}
`;
