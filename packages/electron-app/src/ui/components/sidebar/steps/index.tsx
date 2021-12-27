import { css } from "@emotion/react";
import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { Checkbox, CheckboxProps } from "@dyson/components/atoms/checkbox/checkbox";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { Button } from "@dyson/components/atoms/button/Button";
import { Conditional } from "@dyson/components/layouts";
import { useDispatch, useSelector, useStore } from "react-redux";
import { getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { MoreIcon } from "electron-app/src/extension/assets/icons";
import { LoadingIcon, WarningIcon } from "electron-app/src/ui/icons";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { ACTION_DESCRIPTIONS } from "electron-app/src/extension/constants/actionDescriptions";
import { deleteRecordedSteps } from "electron-app/src/store/actions/recorder";

const Step = ({
	title,
	subtitle,
	isRunning,
	isFailed,
	...props
}: CheckboxProps & { title: string; subtitle: string; isRunning?: boolean; isFailed?: boolean }): JSX.Element => {
	const [isHover, setIsHover] = React.useState(false);

	return (
		<div onMouseOver={setIsHover.bind(this, true)} onMouseLeave={setIsHover.bind(this, false)}>
			<div css={[stepStyle, isRunning && runningStepStyle, (isFailed) && failedStyle]}>
				<Checkbox {...props} />
 				<div css={stepTextStyle}>
					<TextBlock css={[stepTitleStyle, isFailed ? failedStepTitleStyle : null]}>
						{title}
					</TextBlock>
					<TextBlock css={stepSubtitleStyle}>{subtitle}</TextBlock>
				</div>
				<Conditional showIf={isRunning}>
					<LoadingIcon  style={{width: 30, height: 30, marginLeft: 4}} css={css`margin-left: auto;`}/>
				</Conditional>
				<Conditional showIf={isHover && (!isRunning && !isFailed)}>
					<MoreIcon css={css`:hover{ opacity: 0.7; }`} />
				</Conditional>
				<Conditional showIf={isFailed}>
					<MoreIcon css={css`:hover{ opacity: 0.7; }`} />
					<TextBlock css={stepWarningStyle}>
						<WarningIcon css={css`height: 13rem`} />
                        <span css={css`margin-left: 4rem;padding-top:2rem;`}>&nbsp; This step failed</span>
					</TextBlock>
				</Conditional>
			</div>

			<Conditional showIf={isFailed}>
				<div css={failedToDOStyle}>
					<div css={failedToDoHeadStyle}>
						<Text CSS={whatTODOStyle}>What to do?</Text>
						{/* <MoreIcon /> */}
					</div>
					<div css={failedButtonsStyle}>
						<Button size="small" css={failedButtonStyle} bgColor="tertiary-outline">
							Mark optional
						</Button>
						<Button size="small" css={failedButtonStyle} bgColor="tertiary-outline">
							Delete & continue
						</Button>
					</div>
				</div>
			</Conditional>
		</div>
	);
}

enum GroupActionsEnum {
	CREATE_TEMPLATE = "CREATE_TEMPLATE",
	MAKE_OPTIONAL = "MAKE_OPTIONAL",
	DELETE = "DELETE",
};

const GroupActionsMenu = ({showDropDownCallback, callback}) => {
	const ActionItem = ({title, id, callback}) => {
		return (
			<div css={css`:hover { background:#687ef2; }`}  onClick={callback.bind(this, id)}>
				<TextBlock css={dropdownItemTextStyle}>{title}</TextBlock>
			</div>
		);
	};

	return (<>
		<ActionItem title={"Create template"} id={GroupActionsEnum.CREATE_TEMPLATE} callback={callback}/>
		<ActionItem title={"Make optional"} id={GroupActionsEnum.MAKE_OPTIONAL} callback={callback}/>
		<ActionItem title={"Delete"} id={GroupActionsEnum.DELETE} callback={callback}/>
	</>);
}

const StepsPanel = ({className, ...props}: any) => {
    const [checkedSteps, setCheckedSteps] = React.useState(new Set());
    const recordedSteps = useSelector(getSavedSteps);

	const [showGroupActionsDropdown, setShowGroupActionsDropDown] = React.useState(false);
	const dispatch = useDispatch();
	
    const toggleAllSteps = React.useCallback(
		(checked) => {
			if (checked) {
				setCheckedSteps(new Set([...steps.map((step) => step.id)]));
			} else {
				setCheckedSteps(new Set());
			}
		},
		[checkedSteps.size, recordedSteps.length],
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
		[checkedSteps, recordedSteps.length],
	);

    const steps = recordedSteps.map((action, index) => {
		return {
			id: index,
			title: ACTION_DESCRIPTIONS[action.type],
			selector: action.payload && action.payload.selectors && action.payload.selectors.length ? action.payload.selectors[0].value : "window",
			status: action.status
		}
	});

	React.useEffect(() => {
		const testListContainer: any = document.querySelector("#stepsListContainer");
		const elementHeight = testListContainer.scrollHeight;
		testListContainer.scrollBy(0, elementHeight);
	}, [recordedSteps.length]);

	const handleGrouActionSelected = React.useCallback((id) => {
		setShowGroupActionsDropDown(false);
		setCheckedSteps(new Set());

		switch(id) {
			case GroupActionsEnum.MAKE_OPTIONAL:
				alert("Marking selected steps as optional");
				break;
			case GroupActionsEnum.CREATE_TEMPLATE:
				alert("Showing create template modal");
				break;
			case GroupActionsEnum.DELETE:
				const checkedStepIndexArr = Array.from(checkedSteps);
				dispatch(deleteRecordedSteps(checkedStepIndexArr));
				break;
			default:
				break;
		}
	}, [checkedSteps]);
    
    return (
        <div className={`${className}`} css={containerStyle}>
            <div css={stepsHeaderStyle}>
                <Checkbox isSelected={recordedSteps.length === checkedSteps.size} callback={toggleAllSteps} />
                <Text css={stepsTextStyle}>{recordedSteps.length} Steps</Text>
                <Conditional showIf={!!checkedSteps.size}>
                    <div css={stepDropdownStyle}>
                        <Dropdown
							initialState={showGroupActionsDropdown}
                            dropdownCSS={dropdownStyle}
                            component={<GroupActionsMenu callback={handleGrouActionSelected} showDropDownCallback={setShowGroupActionsDropDown.bind(this)}/>}
							callback={setShowGroupActionsDropDown.bind(this)}
						>
                            <MoreIcon onClick={setShowGroupActionsDropDown.bind(this, true)} />
                        </Dropdown>
                    </div>
                </Conditional>
            </div>  

            <div className="custom-scroll" id={"stepsListContainer"} css={stepsContainerStyle}>
				{steps.map((step, index) => (
					<Step
						isSelectAllType={false}
						key={step.id}
						isRunning={step.status === ActionStatusEnum.STARTED}
						isFailed={step.status === ActionStatusEnum.FAILED}
						isSelected={checkedSteps.has(step.id)}
						callback={() => toggleStep(step.id)}
						title={step.title}
						subtitle={step.selector.substr(0, 25)}
					/>
				))}
			</div>
        </div>
    )
};

const containerStyle = css`
    border-top: 1rem solid #303235;
    height: 340rem;
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


const failedStepTitleStyle = css`
	font-weight: 800;
`;
const stepsContainerStyle = css`
	overflow-y: scroll;
	padding: 18rem 22rem;
	padding-top: 0rem;
	height: 100%;
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
	padding: 3rem 13rem;
	margin: 10rem 0rem;
	border: 1.5rem solid rgba(255, 255, 255, 0);

	&:hover {
		border: 1.5rem solid rgba(255, 255, 255, 0.1);
		border-radius: 6rem;
	}
`;

const failedStyle = css`
	border: 1.5rem solid rgba(255, 255, 255, 0.12);
	background: #0f1011;
`;
const stepTextStyle = css`
	margin: 5rem;
	margin-left: 13rem;
	flex: 1 0 50%;
`;
const stepTitleStyle = css`
	font-family: Gilroy !important;
	font-style: 600 !important;
	font-weight: normal !important;
	font-size: 12.6rem !important;
	line-height: 13rem !important;
	color: rgba(215, 223, 225, 0.6) !important;
	user-select: none !important;
`;
const stepSubtitleStyle = css`
	font-family: Gilroy !important;
	font-style: normal !important;
	font-weight: normal !important;
	font-size: 10.5rem !important;
	line-height: 10rem !important;
	margin-top: 6.2rem !important;
	color: #79929A !important;
	user-select: none !important;
`;
const stepWarningStyle = css`
	display: flex;
	align-items: center;
	flex: 0 1 100%;
	font-family: Gilroy;
	font-style: normal;
	font-weight: 600;
	font-size: 13rem;
	line-height: 13rem;
	color: #de3d76;
	padding: 6rem;
	margin-top: 8rem;
	margin-bottom: 10rem;
`;
const failedToDOStyle = css`
	padding: 15rem;
	margin: 6rem 0rem;
	background: #0f1011;
	border: 1rem solid rgba(255, 255, 255, 0.12);
	box-sizing: border-box;
	border-radius: 4rem;
`;
const failedButtonsStyle = css`
	display: flex;
`;
const failedToDoHeadStyle = css`
	display: flex;
	flex: 1 1 100%;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8rem;
`;
const whatTODOStyle = css`
	font-family: Gilroy;
	font-weight: 800;
	font-size: 12rem;
`;
const failedButtonStyle = css`
	margin-right: 9rem;
	background: #ffffff;
	border-radius: 4rem;
	font-size: 12rem !important;
	color: #40383b;
	:hover {
		background: rgba(255, 255, 255, 0.8);
	}
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