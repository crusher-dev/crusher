import React from "react";
import { css } from "@emotion/react";
import { Text } from "@dyson/components/atoms/text/Text";
import { ConsoleIcon, ForwardIcon, StopIcon } from "electron-app/src/_ui/constants/old_icons";
import { useSelector, useStore } from "react-redux";
import { getIsStatusBarVisible, getRecorderContext, getRecorderState, getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { Step } from "./step";
import { useSelectableList } from "electron-app/src/_ui/hooks/list";
import { OnOutsideClick } from "@dyson/components/layouts/onOutsideClick/onOutsideClick";
import { RightClickMenu } from "@dyson/components/molecules/RightClick/RightClick";
import { deleteRecordedSteps } from "electron-app/src/store/actions/recorder";
import { performJumpTo, performPauseStepsExecution, performTrackEvent, performVerifyTest, turnOnElementSelectorInspectMode } from "electron-app/src/ipc/perform";
import { useAtom } from "jotai";
import { stepHoverAtom } from "electron-app/src/_ui/store/jotai/steps";
import { editInputAtom } from "electron-app/src/_ui/store/jotai/testsPage";
import { statusBarMaximiseAtom } from "electron-app/src/_ui/store/jotai/statusBar";
import { ResetIcon } from "electron-app/src/_ui/constants/icons";
import { HoverButton } from "electron-app/src/_ui/ui/components/hoverButton";
import { getRemainingSteps } from "electron-app/src/store/selectors/app";
import { PausedStepCard } from "./pausedCard";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";
import { clearToast, showToast, ToastBox } from "electron-app/src/_ui/ui/components/toasts/index";
import { ActionDescriptor } from "runner-utils/src/functions/actionDescriptor";
import { StepErrorTypeEnum } from "runner-utils/src/error.types";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { iAction } from "@shared/types/action";
import { emitShowModal } from "electron-app/src/_ui/ui/containers/components/modals";
import { EDIT_MODE_MAP } from "./stepEditor";
import { getErrorMessage } from "./helper";
import { DesktopAppEventsEnum } from "@shared/modules/analytics/constants";

interface IProps {
	className?: string;
}
const menuItems = [
	{ id: "rename", label: "Rename", shortcut: <div>Enter</div> },
	{ id: "jump-to", label: "Jump to", shortcut: <div>Jump to</div> },
	{ id: "delete", label: "Delete", shortcut: <div>⌘+D</div> },
];


function usePrevious(value) {
	// The ref object is a generic container whose current property is mutable ...
	// ... and can hold any value, similar to an instance property on a class
	const ref = React.useRef();
	// Store current value in ref
	React.useEffect(() => {
		ref.current = value;
	}, [value]); // Only re-run if value changes
	// Return previous value (happens before update in useEffect above)
	return ref.current;
}

const multiMenuItems = [{ id: "delete", label: "Delete", shortcut: <div>⌘+D</div> }];
const StepsPanel = ({ className }: IProps) => {
	const { isItemSelected, selectedList, resetSelected, toggleSelectItem, selectItem } = useSelectableList();
	const recordedSteps = useSelector(getSavedSteps);
	const isStatusBarVisible = useSelector(getIsStatusBarVisible);
	const store = useStore();
	const [, setStepHover] = useAtom(stepHoverAtom);
	const [, setCurrentEditInput] = useAtom(editInputAtom);
	const [isStatusBarMaximised, setIsStatusBarMaximised] = useAtom(statusBarMaximiseAtom);
	const remainingSteps = useSelector(getRemainingSteps);
	const failedCard = recordedSteps.some((step) => step.status === "FAILED");

	const recorderState = useSelector(getRecorderState);
	React.useEffect(() => {
	}, [!!failedCard]);
	const toggleStatusBar = React.useCallback(() => {
		setIsStatusBarMaximised(!isStatusBarMaximised);
	}, [isStatusBarMaximised]);

	const handleStepClick = React.useCallback(
		(stepId) => {
			toggleSelectItem(stepId);
		},
		[toggleSelectItem],
	);

	const remainingStepsList = React.useMemo(() => {
		if (!remainingSteps) return [];
		return remainingSteps.map((step, index) => {
			return (
				<Step
					disabled={true}
					step={step}
					key={index + (recordedSteps?.length || 0)}
					stepId={index + (recordedSteps?.length || 0)}
					isLast={index === remainingSteps.length - 1}
				/>
			);
		});
	}, [remainingSteps, recordedSteps]);


	const handleOutSideClick = React.useCallback(() => {
		// @Note: setTimeOut is here as an hack, to
		// allow selectedList to be sent to contextMenu onClick
		const interval = setTimeout(() => {
			resetSelected();
		}, 100);

		return () => {
			clearTimeout(interval);
		}
	}, [resetSelected]);

	const handleMenuOpenChange = () => { };

	const handleCallback = React.useCallback(
		(id) => {
			switch (id) {
				case "jump-to":
					performJumpTo(selectedList[0]);
					break;
				case "rename":
					setStepHover(selectedList[0]);
					setCurrentEditInput(`${selectedList[0]}-stepName`);
					break;
				case "delete":
					store.dispatch(deleteRecordedSteps(selectedList));
					break;
			}
		},
		[selectedList],
	);

	const menuItemsComponent = React.useMemo(() => {
		if (selectedList.length === 0) return [];
		return (selectedList.length > 1 ? multiMenuItems : menuItems).map((item) => {
			return {
				type: "menuItem",
				value: item.label,
				rightItem: item.shortcut,
				onClick: handleCallback.bind(this, item.id),
			};
		});
	}, [selectedList, handleCallback]);

	const steps = React.useMemo(() => {
		return recordedSteps.map((step, index) => {
			return (
				<RightClickMenu onOpenChange={handleMenuOpenChange} menuItems={menuItemsComponent}>

					<Step
						step={step}
						onContextMenu={selectItem.bind(this, index)}
						onClick={handleStepClick.bind(this, index)}
						isActive={isItemSelected(index)}
						setIsActive={selectItem.bind(this, index)}
						stepId={index}
						isLast={index === recordedSteps.length - 1}
					/>
				</RightClickMenu>
			);
		});
	}, [selectedList, selectItem, handleStepClick, menuItemsComponent, recordedSteps]);

	React.useEffect(() => {
		const keyPressListener = function (e: Event) {
			if (["input", "textarea"].includes((e.target as any).tagName.toLowerCase())) return;
			if (e.key === "Delete" && selectedList.length) {
				store.dispatch(deleteRecordedSteps(selectedList));
				performVerifyTest(false);
			}
		};
		window.addEventListener("keyup", keyPressListener, false);
		return () => {
			window.removeEventListener("keyup", keyPressListener, false);
		};
	}, [recordedSteps, selectedList]);
	const handleResetTest = () => { 
		{ // Tracking 
			const context = getRecorderContext(store.getState() as any);
			performTrackEvent(
				DesktopAppEventsEnum.REVERIFY_CURRENT_TEST,
				{
					context
				}
			);
	   }
		performVerifyTest(false);
	}

	const showNextSteps = remainingSteps && remainingSteps.length && [TRecorderState.RECORDING_ACTIONS, TRecorderState.ACTION_REQUIRED].includes(recorderState.type);
	const showPausedCard = remainingSteps && remainingSteps.length && [TRecorderState.RECORDING_ACTIONS].includes(recorderState.type);
	const failedSteps = recordedSteps.map((a, index) => ({ ...a, index })).filter((step) => step.status === "FAILED");

	const actionDescriber = React.useMemo(() => {
		const actionDescriber = new ActionDescriptor();
		return actionDescriber;
	}, []);

	const previousLength = usePrevious(recordedSteps.length);

	React.useEffect(() => {
		if (recordedSteps.length >= previousLength) {
			const testListContainer: Element = document.querySelector("#steps-list-container");
			const nextStepsList: Element = document.querySelector("#next-steps-list");
			const stepsList: Element = document.querySelector("#steps-list");

			const stepsListHeight = stepsList.getBoundingClientRect().height;
			const lastLiHeight = stepsList.lastChild ? stepsList.lastChild.getBoundingClientRect().height : 0;
			testListContainer.scroll(0, stepsListHeight - lastLiHeight - 1);
		}
	}, [recordedSteps.length, showPausedCard]);

	React.useEffect(() => {
		if (failedSteps.length) {
				const lastFailedStep = failedSteps[failedSteps.length - 1];
				actionDescriber.initActionHandlers();

				const hasCustomErrorToasts = [ActionsInTestEnum.NAVIGATE_URL];
				if(!hasCustomErrorToasts.find(lastFailedStep.type)) {
					const isElementFailure = lastFailedStep.type.startsWith("ELEMENT_") && [StepErrorTypeEnum.ELEMENT_NOT_FOUND, StepErrorTypeEnum.ELEMENT_NOT_STABLE, StepErrorTypeEnum.ELEMENT_NOT_VISIBLE, StepErrorTypeEnum.TIMEOUT].includes(lastFailedStep.errorType);

					console.log("Last Failed Step", lastFailedStep);
					showToast({
						message: getErrorMessage(lastFailedStep),
						type: "step-failed",
						isUnique: true,
						meta: {
							errorType: lastFailedStep.errorType,
							stepId: lastFailedStep.index,
							callback: isElementFailure ? () => {
								console.log("CLICKED, YES");
							} : () => {
								emitShowModal({
									type: EDIT_MODE_MAP[lastFailedStep.type],
									stepIndex: lastFailedStep.index,
								});
							}
						},
					});
				}
		} else {
			clearToast("step-failed");
		}
	}, [failedSteps.length]);

	const handlePause = () => {
		performPauseStepsExecution();
	}

	return (
		<div css={containerCss} className={String(className)}>
			<div css={headerCss} title={""} className="flex items-center">
				<Text css={sectionHeadingCss} className="mt-3">{recordedSteps.length} steps</Text>
				<div css={sectionActionsCss}>
					<HoverButton title={"skip this step"} onClick={handlePause}>
						<ForwardIcon css={forwrdIconCss} />
					</HoverButton>
					<HoverButton title={"reload test"} onClick={handleResetTest}>
						<ResetIcon css={resetIconCss} />
					</HoverButton>
					<HoverButton title={"open logs"} onClick={toggleStatusBar} className={"ml-2"}>
						<ConsoleIcon css={consoleIconCss(isStatusBarMaximised)} />
					</HoverButton>
				</div>
			</div>
			<OnOutsideClick
				className={"custom-scroll"}
				id={"steps-list-container"}
				css={css`
					height: 100%;
					overflow-y: overlay;
				`}
				onOutsideClick={handleOutSideClick}
			>
				<div className={`custom-scroll`} css={contentCss}>
					<div id="steps-list">
						{steps}
					</div>
					{showPausedCard ? (<PausedStepCard />) : ""}
					{showNextSteps ? (<div id="next-steps-list">
						<div className={"px-16 pt-32 pb-4"} css={css`font-style: normal;
font-weight: 400;
font-size: 12rem;color: #DCDCDC;`}>next steps</div>
						{remainingStepsList}
					</div>) : ""}
				</div>
			</OnOutsideClick>
		</div>
	);
};

const forwrdIconCss = css`
width: 14rem;
height: 14rem;
path{
	fill: #5f5f60;
}
:hover{
	path{
		fill: #fff;
	}	
}
`;
const resetIconCss = css`
	width: 12rem;
	height: 12rem;
	path{
		fill: #5f5f60;
	}
	:hover{
		path{
			fill: #fff;
		}	
	}
`;
const containerCss = css`
	border-radius: 4px 4px 0px 0px;
	border-top: 0.5rem solid #141414;
	height: 369rem;
	padding-bottom: 0rem;
	display: flex;
	flex-direction: column;
`;
const headerCss = css`
	display: flex;
	align-items: center;
	padding: 12rem 16rem 12rem 20rem;
	border-bottom: .5px solid #1c1b1b;
`;
const sectionHeadingCss = css`
	font-weight: 500;
	font-size: 13rem;
	color: #BDBDBD;
`;
const sectionActionsCss = css`
	margin-left: auto;
	margin-top: -3rem;
	margin-right: -1rem;
	display: flex;
	align-items: center;
`;
const consoleIconCss = (isActive) => css`
	width: 11.7rem;
	height: 12.3rem;
	padding-top: 1px;
	path {
		fill: ${isActive ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.35)"};
	}
	:hover {
		opacity: 0.7;
	}
`;
const contentCss = css`
	height: 100%;
`;

export { StepsPanel };
