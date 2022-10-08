import React from "react";
import { css } from "@emotion/react";
import { Text } from "@dyson/components/atoms/text/Text";
import { ConsoleIcon } from "electron-app/src/_ui/constants/old_icons";
import { useSelector, useStore } from "react-redux";
import { getIsStatusBarVisible, getRecorderState, getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { Step } from "./step";
import { useSelectableList } from "electron-app/src/_ui/hooks/list";
import { OnOutsideClick } from "@dyson/components/layouts/onOutsideClick/onOutsideClick";
import { RightClickMenu } from "@dyson/components/molecules/RightClick/RightClick";
import { deleteRecordedSteps } from "electron-app/src/store/actions/recorder";
import { performJumpTo, performVerifyTest } from "electron-app/src/_ui/commands/perform";
import { useAtom } from "jotai";
import { stepHoverAtom } from "electron-app/src/_ui/store/jotai/steps";
import { editInputAtom } from "electron-app/src/_ui/store/jotai/testsPage";
import { statusBarMaximiseAtom } from "electron-app/src/_ui/store/jotai/statusBar";
import { ResetIcon } from "electron-app/src/_ui/constants/icons";
import { HoverButton } from "electron-app/src/_ui/ui/components/hoverButton";
import { getRemainingSteps } from "electron-app/src/store/selectors/app";
import { PausedStepCard } from "./pausedCard";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";
import ToastDemo from "electron-app/src/_ui/ui/components/Toast";

interface IProps {
	className?: string;
}
const menuItems = [
	{ id: "rename", label: "Rename", shortcut: <div>Enter</div> },
	{ id: "jump-to", label: "Jump to", shortcut: <div>Jump to</div> },
	{ id: "delete", label: "Delete", shortcut: <div>⌘+D</div> },
];

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
		if(failedCard) { 
			requestAnimationFrame(() => {
			const testListContainer: any = document.querySelector("#steps-list-container");
			const elementHeight = testListContainer.scrollHeight;
			testListContainer.scrollBy(0, elementHeight);
		});
	}
	}, [failedCard]);
	const toggleStatusBar = React.useCallback(() => {
		setIsStatusBarMaximised(!isStatusBarMaximised);
	}, [isStatusBarMaximised]);

	const handleStepClick = React.useCallback(
		(stepId) => {
			toggleSelectItem(stepId);
		},
		[toggleSelectItem],
	);
 
	const steps = React.useMemo(() => {
		return recordedSteps.map((step, index) => {
			return (
				<Step
					step={step}
					onContextMenu={selectItem.bind(this, index)}
					onClick={handleStepClick.bind(this, index)}
					isActive={isItemSelected(index)}
					setIsActive={selectItem.bind(this, index)}
					stepId={index}
					isLast={index === recordedSteps.length - 1}
				/>
			);
		});
	}, [selectedList, selectItem, handleStepClick, recordedSteps]);

	const remainingStepsList = React.useMemo(() => {
		if (!remainingSteps) return [];
		return remainingSteps.map((step, index) => {
			return (
				<Step
					disabled={true}
					step={step}

					stepId={index + steps.length}
					isLast={index === remainingSteps.length - 1}
				/>
			);
		});
	}, [remainingSteps, steps]);
	React.useEffect(() => {
		const testListContainer: any = document.querySelector("#steps-list-container");
		const elementHeight = testListContainer.scrollHeight;
		testListContainer.scrollBy(0, elementHeight);
	}, [recordedSteps.length]);

	const handleOutSideClick = React.useCallback(() => {
		// @Note: setTimeOut is here as an hack, to
		// allow selectedList to be sent to contextMenu onClick
		setTimeout(() => {
			resetSelected();
		}, 100);
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
	const handleResetTest = () => performVerifyTest(false);

	const showNextSteps = remainingSteps && remainingSteps.length && [TRecorderState.RECORDING_ACTIONS, TRecorderState.ACTION_REQUIRED].includes(recorderState.type);
	const showPausedCard = remainingSteps && remainingSteps.length && [TRecorderState.RECORDING_ACTIONS].includes(recorderState.type);
	const hasFailed = recordedSteps.some((step) => step.status === "FAILED");

	return (
		<div css={containerCss} className={String(className)}>
			<div css={headerCss} title={""} className="flex items-center">
				<Text css={sectionHeadingCss} className="mt-3">{recordedSteps.length} steps</Text>
				<div css={sectionActionsCss}>
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
					overflow-y: auto;
				`}
				onOutsideClick={handleOutSideClick}
			>
				<RightClickMenu onOpenChange={handleMenuOpenChange} menuItems={menuItemsComponent}>
					<div className={`custom-scroll`} css={contentCss}>

						{steps}
						{showPausedCard ? (<PausedStepCard />) : ""}
						{showNextSteps ? (<div>
							<div className={"px-16 pt-32 pb-4"} css={css`font-style: normal;
font-weight: 400;
font-size: 12rem;color: #DCDCDC;`}>next steps</div>
							{remainingStepsList}
						</div>) : ""}

						{hasFailed ? (	<ToastDemo/>) : ""}
					</div>
				</RightClickMenu>
			</OnOutsideClick>
		</div>
	);
};

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
