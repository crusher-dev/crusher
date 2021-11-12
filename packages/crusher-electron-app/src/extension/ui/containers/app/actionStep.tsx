import { ActionsInTestEnum, ACTIONS_TO_LABEL_MAP } from "@shared/constants/recordedActions";
import { ActionStatusEnum, iAction } from "@shared/types/action";
import { FailureIcon, LoadingIcon } from "crusher-electron-app/src/extension/assets/icons";
import React, { useEffect, useState } from "react";
import { Conditional } from "../../components/conditional";
import { FLEX_DIRECTION, FONT_WEIGHT, OVERFLOW, POSITION, SCROLL_BEHAVIOR, WHITE_SPACE } from "../../../interfaces/css";
import { Dropdown } from "../../components/app/dropdown";
import { FailedActionEnum } from "crusher-electron-app/src/extension/interfaces/actions";
import {
	markLastRecordedActionAsOptional,
	updateLastRecordedAction,
	updateLastRecordedActionStatus,
	updateSelectedActions,
} from "crusher-electron-app/src/extension/redux/actions/actions";
import { getStore } from "crusher-electron-app/src/extension/redux/store";

interface iActionProps {
	action: iAction;
	onDelete: (actionIndex: number) => void;
	onClick?: any;
	index: number;
	style?: React.CSSProperties;
}

const Action = (props: iActionProps) => {
	const { onClick, action, index, onDelete } = props;
	const actionButtonRef = React.useRef<HTMLDivElement>(null);

	const isActionNotSelectable = checkIfNonSelectableAction(action);
	const shouldShowLoadingSign = action.status && action.status === ActionStatusEnum.STARTED;
	const [shouldShowFailureActionBox, setShouldShowFailureActionBox] = useState(false);

	const [isActionFail, setIsActionFail] = useState(action.status && action.status === ActionStatusEnum.FAILURE);
	useEffect(() => {
		const isFail = action.status && action.status === ActionStatusEnum.FAILURE;
		setIsActionFail(isFail);
	}, [action, action.status]);

	useEffect(() => {
		if (!isActionFail) {
			setShouldShowFailureActionBox(false);
		}
	}, [isActionFail]);

	const handleDelete = (event) => {
		event.stopPropagation();
		onDelete(index);
	};

	const handleFailedActionSelect = async (id: string) => {
		const store = getStore();

		if (id === FailedActionEnum.DELETE) {
			await (window as any).electron.continueRemainingTest();
			await onDelete(index);
		} else if (id === FailedActionEnum.MARK_OPTIONAL) {
			store.dispatch(updateLastRecordedActionStatus(ActionStatusEnum.SUCCESS));
			store.dispatch(markLastRecordedActionAsOptional(true));
			await (window as any).electron.continueRemainingTest();
		} else if (id === FailedActionEnum.REPLACE_STEP) {
			await onDelete(index);
		}

		setShouldShowFailureActionBox(false);
	};

	const handleCheckboxChange = () => {
		const selectedActionCheckboxArr = Array.from(document.querySelectorAll("#selectedSteps"));
		const store = getStore();
		const selectedActionIds = selectedActionCheckboxArr
			.filter((checkbox: HTMLInputElement) => checkbox.checked)
			.map((checkbox: HTMLInputElement) => {
				return { id: checkbox.getAttribute("data-id") };
			});
		store.dispatch(updateSelectedActions(selectedActionIds));
	};

	const actionDescription = getActionDescription(action);

	return (
		<li style={{ marginTop: 21 }}>
			<Conditional If={!isActionFail}>
				<div style={actionStepContainerStyle} onClick={onClick}>
					<div style={inputCheckboxStyle}>
						<Conditional If={!isActionNotSelectable}>
							<input onChange={handleCheckboxChange} data-id={index} type="checkbox" id="selectedSteps" onClick={(e) => e.stopPropagation()} />
						</Conditional>
						<Conditional If={isActionNotSelectable}>
							<img src={chrome.runtime.getURL(ICONS[action.type] ? ICONS[action.type] : "icons/mouse.svg")} />
						</Conditional>
					</div>
					<div style={actionStepDescriptionContainerStyle}>
						<div style={actionStepNameStyle}>{action.name ? action.name : ACTIONS_TO_LABEL_MAP[action.type]}</div>
						<div style={actionStepSelectorStyle}>
							{actionDescription && actionDescription.length > 35 ? actionDescription.substring(0, 35) : actionDescription}
						</div>
					</div>
					<div style={{ marginLeft: "auto" }}>
						<Conditional If={shouldShowLoadingSign}>
							<LoadingIcon style={{ width: 30, height: 30 }} />
						</Conditional>
						<Conditional If={!shouldShowLoadingSign}>
							<Conditional If={!isActionNotSelectable && action.status && action.status === ActionStatusEnum.SUCCESS}>
								<div style={deleteIconContainerStyle} onClick={handleDelete}>
									<img src={"/icons/delete.svg"} style={deleteIconStyle} />
								</div>
							</Conditional>
						</Conditional>
					</div>
				</div>
			</Conditional>
			<Conditional If={isActionFail}>
				<div style={{ background: "#0F1011", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: 5 }}>
					<div style={{ ...actionStepContainerStyle, padding: "12px 10px" }}>
						<div style={inputCheckboxStyle}>
							<img src={chrome.runtime.getURL(ICONS[action.type] ? ICONS[action.type] : "icons/mouse.svg")} />
						</div>
						<div style={actionStepDescriptionContainerStyle}>
							<div style={actionStepNameStyle}>{action.name ? action.name : ACTIONS_TO_LABEL_MAP[action.type]}</div>
							<div style={actionStepSelectorStyle}>{getActionDescription(action)}</div>
						</div>
					</div>
					<div style={{ background: "rgba(143, 143, 255, 0.07)", display: "flex", padding: "15px 12px", alignItems: "center" }}>
						<FailureIcon width={20} height={20} style={{ position: "relative", top: 3, marginLeft: 2 }} />
						<div style={{ color: "#DE3D76", marginLeft: 12, fontSize: 14, fontWeight: 600 }}>This step failed</div>
						<div ref={actionButtonRef} style={takeActionButtonStyle} onClick={setShouldShowFailureActionBox.bind(this, true)}>
							Take action
						</div>
					</div>
					<Conditional If={shouldShowFailureActionBox}>
						<div style={dropdownContainerStyle(actionButtonRef)}>
							<Dropdown
								onOutSideClick={setShouldShowFailureActionBox.bind(this, false)}
								items={[
									{ id: FailedActionEnum.REPLACE_STEP, label: "Replace step" },
									{ id: FailedActionEnum.MARK_OPTIONAL, label: "Mark it optional" },
									{ id: FailedActionEnum.DELETE, label: "Delete & Continue" },
								]}
								onSelect={handleFailedActionSelect}
							/>
						</div>
					</Conditional>
				</div>
			</Conditional>
		</li>
	);
};

const dropdownContainerStyle = (actionButtonRef: React.RefObject<HTMLDivElement>) => {
	const node = actionButtonRef.current;
	const boundingRect = node ? node.getBoundingClientRect() : { top: -500, left: -500, width: 0, height: 0 };

	return {
		left: boundingRect.left - 40 + "px",
		top: boundingRect.top - 124 - boundingRect.height + "px",
		position: POSITION.FIXED,
		width: 138,
		height: 92,
		zIndex: 99,
	};
};

const takeActionButtonStyle = {
	marginLeft: "auto",
	background: "#FFFFFF",
	borderRadius: 3,
	color: "#40383B",
	fontSize: 14,
	padding: "4px 12px",
	cursor: "pointer",
	userSelect: "none" as any,
};

const actionStepNameStyle = {
	color: "rgba(215, 223, 225, 0.6)",
	fontSize: 14.5,
};
const actionStepSelectorStyle = {
	color: "#79929A",
	fontSize: 13,
	marginTop: 4,
};

const actionStepDescriptionContainerStyle = {
	marginLeft: 4,
};

const inputCheckboxStyle = {
	marginTop: 1,
	width: 32,
};

const actionStepContainerStyle = {
	display: "flex",
	flexDirection: FLEX_DIRECTION.ROW,
	color: "#fff",
	alignItems: "center",
};

const actionItemTextContainer = {
	flex: 0.8,
	overflow: "hidden",
};

const deleteIconContainerStyle = {
	display: "flex",
	alignItems: "center",
	marginLeft: "auto",
	paddingRight: "1rem",
};

const deleteIconStyle = {
	width: 13,
};

const stepStyle = {
	display: "flex",
	cursor: "pointer",
	fontFamily: "DM Sans",
	fontStyle: "normal",
	borderRadius: "0.25rem",
	position: POSITION.RELATIVE,
	marginTop: "1rem",
	overflow: "hidden",
};

const stepImageStyle = {
	flex: 0.1,
};

const stepActionStyle = {
	fontWeight: FONT_WEIGHT.BOLD,
	color: "#8C8C8C",
};

const stepSelectorContainerStyle = {
	overflow: OVERFLOW.HIDDEN,
	position: POSITION.RELATIVE,
};
const stepSelectorStyle = {
	marginTop: "0.25rem",
	color: "#8C8C8C",
	whiteSpace: WHITE_SPACE.NOWRAP,
	width: "70%",
	overflow: "hidden",
};

const ICONS = {
	[ActionsInTestEnum.SET_DEVICE as ActionsInTestEnum]: "/icons/actions/set-device.svg",
	[ActionsInTestEnum.NAVIGATE_URL as ActionsInTestEnum]: "/icons/actions/navigate.svg",
	[ActionsInTestEnum.CLICK as ActionsInTestEnum]: "/icons/actions/click.svg",
	[ActionsInTestEnum.HOVER as ActionsInTestEnum]: "/icons/actions/hover.svg",
	[ActionsInTestEnum.ELEMENT_SCREENSHOT as ActionsInTestEnum]: "/icons/actions/screenshot.svg",
	[ActionsInTestEnum.PAGE_SCREENSHOT as ActionsInTestEnum]: "/icons/actions/screenshot.svg",
	[ActionsInTestEnum.VALIDATE_SEO as ActionsInTestEnum]: "/icons/actions/seo.svg",
	[ActionsInTestEnum.BLACKOUT as ActionsInTestEnum]: "/icons/actions/blackout.svg",
	[ActionsInTestEnum.CUSTOM_ELEMENT_SCRIPT as ActionsInTestEnum]: "/icons/actions/custom-script.svg",
	[ActionsInTestEnum.ASSERT_ELEMENT as ActionsInTestEnum]: "/icons/actions/assert-modal.svg",
	[ActionsInTestEnum.ELEMENT_FOCUS as ActionsInTestEnum]: "/icons/actions/click.svg",
	[ActionsInTestEnum.RUN_TEMPLATE as ActionsInTestEnum]: "/icons/actions/click.svg",
};

// If possbile, just return a selector
function getActionDescription(action: iAction) {
	if (action.type === ActionsInTestEnum.PAGE_SCROLL || action.type === ActionsInTestEnum.ELEMENT_SCROLL) {
		return "Performing scroll";
	}

	if (action.payload.selectors && action.payload.selectors[0]) {
		return action.payload.selectors[0].value;
	} else if (action.type === ActionsInTestEnum.RUN_TEMPLATE) {
		return "Run this template";
	}

	return "Unknown Action";
}

// If possible selectors

function checkIfNonSelectableAction(action: iAction) {
	if (!action || action.type === ActionsInTestEnum.RUN_TEMPLATE) return true;

	return action.type.startsWith("BROWSER") && action.type !== ActionsInTestEnum.RUN_AFTER_TEST;
}

export { Action };
