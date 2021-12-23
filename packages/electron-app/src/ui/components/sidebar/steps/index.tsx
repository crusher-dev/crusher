import { css } from "@emotion/react";
import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { Checkbox, CheckboxProps } from "@dyson/components/atoms/checkbox/checkbox";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { Button } from "@dyson/components/atoms/button/Button";
import { Conditional } from "@dyson/components/layouts";
import { useSelector } from "react-redux";
import { getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { MoreIcon } from "electron-app/src/extension/assets/icons";

const StepsPanel = ({className, ...props}: any) => {
    const [checkedSteps, setCheckedSteps] = React.useState(new Set());
    const recordedSteps = useSelector(getSavedSteps);

    const toggleAllSteps = () => {};
    
    return (
        <div className={`${className}`} css={containerStyle}>
            <div css={stepsHeaderStyle}>
                <Checkbox isSelected={recordedSteps.length === checkedSteps.size} callback={toggleAllSteps} />
                <Text css={stepsTextStyle}>{recordedSteps.length} Steps</Text>
                <Conditional showIf={!!checkedSteps.size}>
                    <div css={stepDropdownStyle}>
                        <Dropdown
                            dropdownCSS={dropdownStyle}
                            component={
                                <>
                                    <TextBlock css={dropdownItemTextStyle}>Create template</TextBlock>
                                    <TextBlock css={dropdownItemTextStyle}>Create template</TextBlock>
                                    <TextBlock css={dropdownItemTextStyle}>Create template</TextBlock>
                                </>
                            }>
                            <MoreIcon />
                        </Dropdown>
                    </div>
                </Conditional>
            </div>  
        </div>
    )
};

const containerStyle = css`
    border-top: 1rem solid #303235;
    max-height: 375rem;
    padding-bottom: 32rem;
`;
const stepsHeaderStyle = css`
	display: flex;
	align-items: center;
	padding: 14rem 22rem;
	padding-top: 21rem;
`;
const stepsTextStyle = css`
	font-family: Cera Pro;
	font-size: 14rem;
	flex-grow: 1;
	margin: 0rem 12rem;
`;
const stepDropdownStyle = css`
	box-sizing: border-box;
	position: relative;
	display: block;
`;
const dropdownStyle = css`
	width: 160rem;
	transform: translate(-80%, -40%);
`;
const dropdownItemTextStyle = css`
	padding: 6rem 16rem;
`;
export {StepsPanel};


// export function Steps(): JSX.Element {
// 	const recorderSteps = useSelector(getActions);
// 	const steps = recorderSteps.map((action, index) => {
// 		return {
// 			id: index,
// 			title: ACTION_DESCRIPTIONS[action.type],
// 			selector: action.payload && action.payload.selectors && action.payload.selectors.length ? action.payload.selectors[0].value : "window",
// 			isRunning: false,
// 			isFailed: false
// 		}
// 	});


// 	useEffect(() => {
// 		const testListContainer: any = document.querySelector("#stepsListContainer");
// 		const elementHeight = testListContainer.scrollHeight;
// 		testListContainer.scrollBy(0, elementHeight);
// 	}, [recorderSteps.length]);

// 	const [checkedSteps, setCheckedSteps] = React.useState(new Set());

// 	const toggleAllSteps = React.useCallback(
// 		(checked) => {
// 			if (checked) {
// 				setCheckedSteps(new Set([...steps.map((step) => step.id)]));
// 			} else {
// 				setCheckedSteps(new Set());
// 			}
// 		},
// 		[checkedSteps.size, recorderSteps.length],
// 	);

// 	const toggleStep = React.useCallback(
// 		(index) => {
// 			const selectedSteps = new Set(checkedSteps);
// 			console.log(checkedSteps);
// 			if (checkedSteps.has(index)) {
// 				selectedSteps.delete(index);
// 			} else {
// 				selectedSteps.add(index);
// 			}

// 			setCheckedSteps(selectedSteps);
// 		},
// 		[checkedSteps, recorderSteps.length],
// 	);

// 	return (
// 		<div css={container}>
// 			<div css={stepsHeaderStyle}>
// 				<Checkbox isSelected={steps.length === checkedSteps.size} callback={toggleAllSteps} />
// 				<Text CSS={stepsText}>{steps.length} Steps</Text>
// 				<Conditional showIf={!!checkedSteps.size}>
// 					<div css={stepDropdown}>
// 						<Dropdown
// 							dropdownCSS={dropdownCSS}
// 							component={
// 								<>
// 									<TextBlock css={dropdownItemText}>Create template</TextBlock>
// 									<TextBlock css={dropdownItemText}>Create template</TextBlock>
// 									<TextBlock css={dropdownItemText}>Create template</TextBlock>
// 								</>
// 							}
// 						>
// 							<MoreIcon />
// 						</Dropdown>
// 					</div>
// 				</Conditional>
// 			</div>
// 			<div className="custom-scroll" id={"stepsListContainer"} css={stepsContainer}>
// 				{steps.map((step) => (
// 					<Step
// 						isSelectAllType={false}
// 						key={step.id}
// 						isRunning={step.isRunning}
// 						isFailed={step.isFailed}
// 						isSelected={checkedSteps.has(step.id)}
// 						callback={() => toggleStep(step.id)}
// 						title={step.title}
// 						subtitle={step.selector.substr(0, 25)}
// 					/>
// 				))}
// 			</div>
// 		</div>
// 	);
// }

// function Step({
// 	title,
// 	subtitle,
// 	isRunning,
// 	isFailed,
// 	...props
// }: CheckboxProps & { title: string; subtitle: string; isRunning?: boolean; isFailed?: boolean }): JSX.Element {
// 	return (
// 		<div>
// 			<div css={[stepStyle, isRunning && runningStepStyle, isFailed && failedStyle]}>
// 				<Checkbox {...props} />
// 				<div css={stepText}>
// 					<TextBlock css={stepTitle} CSS={isFailed && failedStepTitle}>
// 						{title}
// 					</TextBlock>
// 					<TextBlock css={stepSubtitle}>{subtitle}</TextBlock>
// 				</div>
// 				<Conditional showIf={isFailed}>
// 					<MoreIcon />
// 					<TextBlock CSS={stepWarning}>
// 						<WarningIcon /> &nbsp; This step failed
// 					</TextBlock>
// 				</Conditional>
// 			</div>

// 			<Conditional showIf={isFailed}>
// 				<div css={failedToDO}>
// 					<div css={failedToDoHead}>
// 						<Text CSS={whatTODO}>What to do?</Text>
// 						<MoreIcon />
// 					</div>
// 					<div css={failedButtons}>
// 						<Button size="small" CSS={failedButton} bgColor="tertiary-outline">
// 							Mark optional
// 						</Button>
// 						<Button size="small" CSS={failedButton} bgColor="tertiary-outline">
// 							Delete & continue
// 						</Button>
// 					</div>
// 				</div>
// 			</Conditional>
// 		</div>
// 	);
// }
// const failedStepTitle = css`
// 	font-weight: 800;
// `;
// const container = css`
// 	border-top: 1rem solid #303235;
// 	max-height: 375rem;
// 	padding-bottom: 32rem;
// `;
// const dropdownItemText = css`
// 	padding: 6rem 16rem;
// `;
// const stepsContainer = css`
// 	overflow-y: scroll;
// 	padding: 18rem 22rem;
// 	padding-top: 0rem;
// 	height: 100%;
// `;
// const runningStepStyle = css`
// 	border: 1rem solid rgba(255, 255, 255, 0.1);
// 	border-bottom: 4rem solid #a6ba86;
// `;
// const stepStyle = css`
// 	display: flex;
// 	flex-wrap: wrap;
// 	align-items: center;
// 	box-sizing: border-box;
// 	border-radius: 6rem;
// 	padding: 3rem 13rem;
// 	margin: 10rem 0rem;
// 	border: 1.5rem solid rgba(255, 255, 255, 0);

// 	&:hover {
// 		border: 1.5rem solid rgba(255, 255, 255, 0.1);
// 		border-radius: 6rem;
// 	}
// `;

// const failedStyle = css`
// 	border: 1rem solid rgba(255, 255, 255, 0.12);
// 	background: #0f1011;
// `;
// const stepText = css`
// 	margin: 5rem;
// 	margin-left: 13rem;
// 	flex: 1 0 50%;
// `;
// const stepTitle = css`
// 	font-family: Gilroy !important;
// 	font-style: 600 !important;
// 	font-weight: normal !important;
// 	font-size: 12.6rem !important;
// 	line-height: 13rem !important;
// 	color: rgba(215, 223, 225, 0.6) !important;
// 	user-select: none !important;
// `;
// const stepSubtitle = css`
// 	font-family: Gilroy !important;
// 	font-style: normal !important;
// 	font-weight: normal !important;
// 	font-size: 10.5rem !important;
// 	line-height: 10rem !important;
// 	margin-top: 6.2rem !important;
// 	color: #79929A !important;
// 	user-select: none !important;
// `;
// const stepWarning = css`
// 	display: block;
// 	flex: 0 1 100%;
// 	font-family: Gilroy;
// 	font-style: normal;
// 	font-weight: 600;
// 	font-size: 13rem;
// 	line-height: 13rem;
// 	color: #de3d76;
// 	padding: 6rem;
// 	padding-bottom: 20rem;
// `;
// const failedToDO = css`
// 	padding: 15rem;
// 	margin: 6rem 0rem;
// 	background: #0f1011;
// 	border: 1rem solid rgba(255, 255, 255, 0.12);
// 	box-sizing: border-box;
// 	border-radius: 4rem;
// `;
// const failedButtons = css`
// 	display: flex;
// `;
// const failedToDoHead = css`
// 	display: flex;
// 	flex: 1 1 100%;
// 	justify-content: space-between;
// 	align-items: center;
// 	margin-bottom: 8rem;
// `;
// const whatTODO = css`
// 	font-family: Gilroy;
// 	font-weight: 800;
// 	font-size: 12rem;
// `;
// const failedButton = css`
// 	margin-right: 9rem;
// 	background: #ffffff;
// 	border-radius: 4rem;
// 	font-size: 12rem !important;
// 	color: #40383b;
// 	:hover {
// 		background: rgba(255, 255, 255, 0.8);
// 	}
// `;

// // export { StepsPanel }