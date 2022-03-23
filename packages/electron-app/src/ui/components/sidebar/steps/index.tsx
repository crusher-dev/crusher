import { css } from "@emotion/react";
import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { Checkbox, CheckboxProps } from "@dyson/components/atoms/checkbox/checkbox";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { Button } from "@dyson/components/atoms/button/Button";
import { Conditional } from "@dyson/components/layouts";
import { useDispatch, useSelector, useStore } from "react-redux";
import { getRecorderState, getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { MoreIcon, MuteIcon } from "../../../icons";
import { LoadingIcon, WarningIcon } from "electron-app/src/ui/icons";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { deleteRecordedSteps, markRecordedStepsOptional, updateRecordedStep, updateRecorderState } from "electron-app/src/store/actions/recorder";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";
import { continueRemainingSteps, performJumpTo } from "electron-app/src/ui/commands/perform";
import { getAppSessionMeta, getRemainingSteps } from "electron-app/src/store/selectors/app";
import { TemplatesModal } from "./templatesModal";
import { StepInfoEditor } from "../stepEditor";
import { iAction } from "@shared/types/action";
import { Tooltip } from "@dyson/components/atoms/tooltip/Tooltip";
import { ActionDescriptor } from "runner-utils/src/index";

const actionDescriptor = new ActionDescriptor();

export const ACTION_DESCRIPTIONS = {
	[ActionsInTestEnum.CLICK]: "Click on element",
	[ActionsInTestEnum.HOVER]: "Hover on element",
	[ActionsInTestEnum.PAGE_SCREENSHOT]: "Take screenshot of page",
	[ActionsInTestEnum.ELEMENT_SCREENSHOT]: "Take screenshot of element",
	[ActionsInTestEnum.ELEMENT_FOCUS]: "Focus on element",
	[ActionsInTestEnum.BLACKOUT]: "Blackout element",
	[ActionsInTestEnum.PRESS]: "Press on element",
	[ActionsInTestEnum.ADD_INPUT]: "Add input to element",
	[ActionsInTestEnum.SET_DEVICE]: "Set device",
	[ActionsInTestEnum.RUN_AFTER_TEST]: "Run after test",
	[ActionsInTestEnum.RUN_TEMPLATE]: "Run template",
	[ActionsInTestEnum.NAVIGATE_URL]: "Navigate to URL",
	[ActionsInTestEnum.VALIDATE_SEO]: "Validate SEO",
	[ActionsInTestEnum.WAIT_FOR_NAVIGATION]: "Wait for navigation",
	[ActionsInTestEnum.PAGE_SCROLL]: "Scroll page",
	[ActionsInTestEnum.ELEMENT_SCROLL]: "Scroll element",
	[ActionsInTestEnum.WAIT]: "Wait",
	[ActionsInTestEnum.ASSERT_ELEMENT]: "Assert element",
	[ActionsInTestEnum.CUSTOM_ELEMENT_SCRIPT]: "Custom element script",
	[ActionsInTestEnum.CUSTOM_CODE]: "Custom code",
	[ActionsInTestEnum.RELOAD_PAGE]: "Reload page",
	[ActionsInTestEnum.BACK_PAGE]: "Go back page",
	[ActionsInTestEnum.ASSERT_ELEMENT_VISIBILITY]: "Assert element visibility",
};

enum StepActionsEnum {
	EDIT = "EDIT",
	DELETE = "DELETE",
	JUMP_TO = "JUMP_TO",
}

const StepActionMenu = ({ showDropDownCallback, callback }) => {
	const ActionItem = ({ title, id, callback }) => {
		return (
			<div
				css={css`
					:hover {
						background: #687ef2;
					}
				`}
				onClick={callback.bind(this, id)}
			>
				<TextBlock css={dropdownItemTextStyle}>{title}</TextBlock>
			</div>
		);
	};

	return (
		<>
			{/* <ActionItem title={"Create template"} id={GroupActionsEnum.CREATE_TEMPLATE} callback={callback}/> */}
			<ActionItem title={"Edit"} id={StepActionsEnum.EDIT} callback={callback} />
			<ActionItem title={"Jump to"} id={StepActionsEnum.JUMP_TO} callback={callback} />
			<ActionItem title={"Delete"} id={StepActionsEnum.DELETE} callback={callback} />
		</>
	);
};

/*
	A function to replace text within outer brackets, counting the number of brackets
	e.g.
		"Click on [input[type="text"]] [https://google.com]" => "Click on (input[type="text"]) (https://google.com)"
		"Navigate to [https://google.com]" => "Navigate to (https://google.com)"
*/
let parseText = (text: string): Array<{type: "normal" | "highlight", value: string}> => {
	let count = 0;
	let start = 0;
	let end = 0;
	let newText = "";
	let finalArr = [];
	for (let i = 0; i < text.length; i++) {
		if (text[i] === "[") {
			count++;
			if (count === 1) {
				start = i;
				finalArr.push({ type: "normal", value: newText });
				newText = "";
			}
		} else if (text[i] === "]") {
			count--;
			if (count === 0) {
				end = i;
				finalArr.push({ type: "highlight", value: text.substring(start+1, end) });

			}
		} else if (count === 0) {
			newText += text[i];
		}
	}
	if(count !== 0) {
		finalArr.push({ type: "highlight", value: text.substring(start + 1) });
		newText = "";
	}
	if(newText && newText.length) {
		finalArr.push({ type: "normal", value: newText });
	}
	return finalArr;
};



const Step = ({
	stepIndex,
	action,
	title,
	subtitle,
	isRunning,
	isFailed,
	...props
}: CheckboxProps & { action: iAction; stepIndex: string | number; title: string; subtitle: string; isRunning?: boolean; isFailed?: boolean }): JSX.Element => {
	const [isHover, setIsHover] = React.useState(false);
	const [showStepActionDropdown, setShowStepActionDropdown] = React.useState(false);
	const [isPinned, setIsPinned] = React.useState(false);
	const dispatch = useDispatch();
	const store = useStore();
	const recorderState = useSelector(getRecorderState);

	React.useEffect(() => {
		setShowStepActionDropdown(false);
	}, [isHover]);

	const handleStepActionDropdown = (id) => {
		const recorderState = getRecorderState(store.getState());
		setShowStepActionDropdown(false);
		switch (id) {
			case StepActionsEnum.DELETE: {
				if (recorderState.type === TRecorderState.ACTION_REQUIRED) {
					dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {}));
				}
				dispatch(deleteRecordedSteps([stepIndex]));
				break;
			}
			case StepActionsEnum.JUMP_TO: {
				performJumpTo(stepIndex);
				break;
			}
		}
	};

	const handleDeleteAndContinue = () => {
		const recorderState = getRecorderState(store.getState());

		dispatch(deleteRecordedSteps([stepIndex]));
		continueRemainingSteps();
	};

	const updateAndReRunStep = () => {
		const savedSteps = getSavedSteps(store.getState());

		const step = savedSteps[stepIndex];
		dispatch(deleteRecordedSteps([stepIndex]));

		continueRemainingSteps([{
			...step,
			status: ActionStatusEnum.STARTED,
		}]);
	};

	const finalIsRunning = isRunning;

	const handleSetIsPinned = (value) => {
		setIsPinned(value);
		if (!value) {
			setIsHover(false);
		}
	};

	const titleTag = title && title.length ? parseText(title).map((a) => {
		if(a.type === "highlight") {
			return (<span className="highlight-box">{a.value.length > 15 ? `${a.value.substring(0, 15)}...` : a.value}</span>);
		} else {
			return (<span>{a.value}</span>);
		}
	}) : null;

	return (
		<div
			onMouseOver={() => {
				setIsHover(true);
			}}
			onMouseLeave={setIsHover.bind(this, false)}
			className="recorded-step"
			data-step-id={stepIndex}
			data-type={action.type}
			data-status={action.status}
		>
			<div css={[stepStyle, isHover && hoverStepStyle, finalIsRunning && runningStepStyle, isFailed && failedStyle]}>
				<div className="flex flex-col">
					<Checkbox {...props} />
					<Conditional showIf={action.payload.isOptional}>
						<MuteIcon
							css={css`
								height: 9rem;
								margin-top: 6rem;
							`}
						/>
					</Conditional>
				</div>
				<div css={stepTextStyle}>
					<TextBlock css={[stepTitleStyle, isFailed ? failedStepTitleStyle : null]}>{titleTag}</TextBlock>
					<TextBlock css={stepSubtitleStyle}>{subtitle}</TextBlock>
				</div>
				<Conditional showIf={finalIsRunning}>
					<LoadingIcon
						style={{ width: "16rem", height: "16rem", marginLeft: "4rem" }}
						css={css`
							margin-left: auto;
						`}
					/>
				</Conditional>
				<Conditional showIf={isHover && !finalIsRunning}>
					<div
						css={css`
							align-self: stretch;
							.outsideDiv,
							.showOnClick {
								height: 100%;
							}
						`}
					>
						<Dropdown
							initialState={showStepActionDropdown}
							dropdownCSS={dropdownStyle}
							component={<StepActionMenu callback={handleStepActionDropdown} showDropDownCallback={setShowStepActionDropdown.bind(this)} />}
							callback={setShowStepActionDropdown.bind(this)}
						>
							<MoreIcon
								onClick={setShowStepActionDropdown.bind(this, true)}
								css={css`
									width: 15rem;
									height: 100%;
									:hover {
										opacity: 0.7;
									}
								`}
							/>
						</Dropdown>
					</div>
				</Conditional>

				<Conditional showIf={isFailed}>
					<TextBlock css={stepWarningStyle}>
						<WarningIcon
							css={css`
								height: 13rem;
							`}
						/>
						<span
							css={css`
								margin-left: 4rem;
								padding-top: 2rem;
							`}
						>
							&nbsp; This step failed
						</span>
					</TextBlock>
				</Conditional>
			</div>

			<Conditional showIf={isFailed}>
				<div css={failedToDOStyle}>
					<div css={failedToDoHeadStyle}>
						<Text css={whatTODOStyle}>What to do?</Text>
						{/* <MoreIcon /> */}
					</div>
					<div css={failedButtonsStyle}>
						<Tooltip
							padding={8}
							type={"hover"}
							placement="top"
							content={
								<div
									css={css`
										padding: 4rem;
									`}
								>
									Runs this step again,
									<br />
									usually after modifying it.
								</div>
							}
						>
							<Button size="small" onClick={updateAndReRunStep} css={failedButtonStyle} bgColor="tertiary-outline">
								Retry step
							</Button>
						</Tooltip>
						<Tooltip
							padding={8}
							type={"hover"}
							content={
								<div
									css={css`
										padding: 4rem;
									`}
								>
									Delete this step, and
									<br />
									continue on with the test
								</div>
							}
							placement="top"
						>
							<Button size="small" onClick={handleDeleteAndContinue} css={failedButtonStyle} bgColor="tertiary-outline">
								Delete & continue
							</Button>
						</Tooltip>
					</div>
				</div>
			</Conditional>
			<Conditional showIf={isHover || isPinned}>
				<StepInfoEditor action={action} isPinned={isPinned} setIsPinned={handleSetIsPinned.bind(this)} actionIndex={stepIndex} />
			</Conditional>
		</div>
	);
};

enum GroupActionsEnum {
	CREATE_TEMPLATE = "CREATE_TEMPLATE",
	MAKE_OPTIONAL = "MAKE_OPTIONAL",
	DELETE = "DELETE",
}

const GroupActionsMenu = ({ showDropDownCallback, callback }) => {
	const ActionItem = ({ title, id, callback }) => {
		return (
			<div
				css={css`
					:hover {
						background: #687ef2;
					}
				`}
				onClick={callback.bind(this, id)}
			>
				<TextBlock css={dropdownItemTextStyle}>{title}</TextBlock>
			</div>
		);
	};

	return (
		<>
			{/* <ActionItem title={"Create template"} id={GroupActionsEnum.CREATE_TEMPLATE} callback={callback}/> */}
			<ActionItem title={"Make optional"} id={GroupActionsEnum.MAKE_OPTIONAL} callback={callback} />
			<ActionItem title={"Delete"} id={GroupActionsEnum.DELETE} callback={callback} />
		</>
	);
};

const StepsPanel = ({ className, ...props }: any) => {
	const [checkedSteps, setCheckedSteps] = React.useState(new Set());
	const recordedSteps = useSelector(getSavedSteps);
	const remainingSteps = useSelector(getRemainingSteps);
	const recorderState = useSelector(getRecorderState);
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
			action: action,
			id: index,
			title: action.name ? action.name : actionDescriptor.describeAction(action as any),
			selector: action.payload && action.payload.selectors && action.payload.selectors.length ? action.payload.selectors[0].value : "window",
			status: action.status,
		};
	});

	React.useEffect(() => {
		const testListContainer: any = document.querySelector("#steps-list-container");
		const elementHeight = testListContainer.scrollHeight;
		testListContainer.scrollBy(0, elementHeight);
	}, [recordedSteps.length]);

	React.useEffect(() => {
		if (recorderState.type === TRecorderState.ACTION_REQUIRED) {
			const testListContainer: any = document.querySelector("#steps-list-container");
			const elementHeight = testListContainer.scrollHeight;
			testListContainer.scrollBy(0, elementHeight);
		}
	}, [recorderState.type]);

	const handleGrouActionSelected = React.useCallback(
		(id) => {
			setShowGroupActionsDropDown(false);
			setCheckedSteps(new Set());
			const checkedStepIndexArr = Array.from(checkedSteps);

			switch (id) {
				case GroupActionsEnum.MAKE_OPTIONAL:
					dispatch(markRecordedStepsOptional(checkedStepIndexArr));
					break;
				case GroupActionsEnum.CREATE_TEMPLATE:
					break;
				case GroupActionsEnum.DELETE:
					dispatch(deleteRecordedSteps(checkedStepIndexArr));
					break;
				default:
					break;
			}
		},
		[checkedSteps],
	);

	const handleContinueTest = () => {
		continueRemainingSteps();
	};

	return (
		<div className={`${className}`} id="steps-pane" css={containerStyle}>
			<div css={stepsHeaderStyle}>
				<Checkbox isSelected={recordedSteps.length === checkedSteps.size} callback={toggleAllSteps} />
				<Text css={stepsTextStyle}>{recordedSteps.length} Steps</Text>
				<Conditional showIf={!!checkedSteps.size}>
					<div css={stepDropdownStyle}>
						<Dropdown
							initialState={showGroupActionsDropdown}
							dropdownCSS={dropdownStyle}
							component={<GroupActionsMenu callback={handleGrouActionSelected} showDropDownCallback={setShowGroupActionsDropDown.bind(this)} />}
							callback={setShowGroupActionsDropDown.bind(this)}
						>
							<MoreIcon
								css={css`
									width: 15rem;
								`}
								onClick={setShowGroupActionsDropDown.bind(this, true)}
							/>
						</Dropdown>
					</div>
				</Conditional>
			</div>

			<div className="custom-scroll" id={"steps-list-container"} css={stepsContainerStyle}>
				{steps.map((step, index) => (
					<Step
						isSelectAllType={false}
						key={step.id}
						action={step.action}
						stepIndex={step.id}
						isRunning={step.status === ActionStatusEnum.STARTED}
						isFailed={step.status === ActionStatusEnum.FAILED}
						isSelected={checkedSteps.has(step.id)}
						callback={() => toggleStep(step.id)}
						title={step.title}
						subtitle={step.selector ? step.selector.substr(0, 25) : ""}
					/>
				))}

				<Conditional showIf={remainingSteps && remainingSteps.length > 0}>
					<div
						css={css`
							margin-top: 12rem;
							display: flex;
							justify-content: center;
						`}
					>
						<span
							onClick={handleContinueTest}
							css={css`
								color: #fff;
								font-size: 13rem;
								text-decoration: underline;
								text-underline-offset: 2rem;
								:hover {
									opacity: 0.9;
								}
							`}
						>
							Continue to test
						</span>
					</div>
				</Conditional>
			</div>
		</div>
	);
};

const containerStyle = css`
	border-top: 1rem solid #303235;
	height: 340rem;
	padding-bottom: 32rem;
`;
const stepsHeaderStyle = css`
	display: flex;
	align-items: center;
	padding: 14rem 16rem;
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

	align-self: stretch;
	.outsideDiv,
	.showOnClick {
		height: 100%;
	}
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
	padding-top: 0rem;
	height: 100%;
	padding-bottom: 100rem;
`;
const runningStepStyle = css`
	border-left: 3rem solid #9462ff;
	&:hover {
		border: 1.5rem solid rgba(255, 255, 255, 0.1) !important;
		border-left: 3rem solid #9462ff !important;
	}
`;
const stepStyle = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	box-sizing: border-box;
	border: 1.5rem solid rgba(255, 255, 255, 0);
	border-left: none;
	padding: 3rem 13rem;
	margin: 10rem 0rem;
`;
const hoverStepStyle = css`
	border: 1.5rem solid rgba(255, 255, 255, 0.1);
	border-left: none;
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
	margin-bottom: 10rem !important;
`;
const stepSubtitleStyle = css`
	font-family: Gilroy !important;
	font-style: normal !important;
	font-weight: normal !important;
	font-size: 10.5rem !important;
	line-height: 10rem !important;
	margin-top: 6.2rem !important;
	color: #79929a !important;
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

export { StepsPanel };
