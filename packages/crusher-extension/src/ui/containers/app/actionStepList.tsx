import React, { useEffect } from "react";
import {
	FONT_WEIGHT,
	OVERFLOW,
	POSITION,
	SCROLL_BEHAVIOR,
	WHITE_SPACE,
} from "../../../interfaces/css";
import { ACTIONS_IN_TEST } from "../../../../../crusher-shared/constants/recordedActions";
import { iAction } from "../../../../../crusher-shared/types/action";
import { useSelector } from "react-redux";
import { getActions } from "../../../redux/selectors/actions";
import { getStore } from "../../../redux/store";
import { deleteRecordedAction } from "../../../redux/actions/actions";
import { Conditional } from "../../components/conditional";

interface iActionProps {
	action: iAction;
	onDelete: (actionIndex: number) => void;
	index: number;
	style?: React.CSSProperties;
}

function getActionDescription(action: iAction) {
	if (action.type === ACTIONS_IN_TEST.SCROLL) {
		return "Performing scroll";
	}

	if (action.payload.selectors && action.payload.selectors[0]) {
		return action.payload.selectors[0].value;
	}

	return "Unknown Action";
}

const ICONS = {
	[ACTIONS_IN_TEST.SET_DEVICE as ACTIONS_IN_TEST]: "/icons/actions/set-device.svg",
	[ACTIONS_IN_TEST.NAVIGATE_URL as ACTIONS_IN_TEST]: "/icons/actions/navigate.svg",
	[ACTIONS_IN_TEST.CLICK as ACTIONS_IN_TEST]: "/icons/actions/click.svg",
	[ACTIONS_IN_TEST.HOVER as ACTIONS_IN_TEST]: "/icons/actions/hover.svg",
	[ACTIONS_IN_TEST.ELEMENT_SCREENSHOT as ACTIONS_IN_TEST]: "/icons/actions/screenshot.svg",
	[ACTIONS_IN_TEST.PAGE_SCREENSHOT as ACTIONS_IN_TEST]: "/icons/actions/screenshot.svg",
	[ACTIONS_IN_TEST.VALIDATE_SEO as ACTIONS_IN_TEST]: "/icons/actions/seo.svg",
	[ACTIONS_IN_TEST.BLACKOUT as ACTIONS_IN_TEST]: "icons/actions/blackout.svg",
	[ACTIONS_IN_TEST.CUSTOM_ELEMENT_SCRIPT as ACTIONS_IN_TEST]: "icons/actions/custom-script.svg",
	[ACTIONS_IN_TEST.ASSERT_ELEMENT as ACTIONS_IN_TEST]: "icons/actions/assert-modal.svg",
	[ACTIONS_IN_TEST.ELEMENT_FOCUS as ACTIONS_IN_TEST]: "icons/actions/click.svg",
};

const Action = (props: iActionProps) => {
	const { action, index, onDelete } = props;

	const handleDelete = () => {
		onDelete(index);
	};

	const isDefaultAction = index < 2;

	return (
		<li style={stepStyle}>
			<div style={stepImageStyle}>
				<img
					src={chrome.runtime.getURL(
						ICONS[action.type] ? ICONS[action.type] : "icons/mouse.svg",
					)}
				/>
			</div>
			<div style={actionItemTextContainer}>
				<div style={stepActionStyle}>{action.type}</div>
				<div style={stepSelectorContainerStyle}>
					<div style={stepSelectorStyle}>{getActionDescription(action)}</div>
				</div>
			</div>
			<Conditional If={!isDefaultAction}>
				<div style={deleteIconContainerStyle} onClick={handleDelete}>
					<img src={"/icons/delete.svg"} style={deleteIconStyle} />
				</div>
			</Conditional>
			<div
				className="text-white flex items-center text-xl"
				style={{ color: stepActionStyle.color }}
			>
				&gt;
			</div>
			<div style={stepIndexNumberingStyle}>{index + 1}</div>
		</li>
	);
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
	width: 16,
};

const ActionStepList = () => {
	const actions = useSelector(getActions);

	useEffect(() => {
		const testListContainer: any = document.querySelector("#stepsListContainer");
		const elementHeight = testListContainer.scrollHeight;
		testListContainer.scrollBy(0, elementHeight);
	});

	const handleDeleteAction = (actionIndex: number) => {
		const store = getStore();
		store.dispatch(deleteRecordedAction(actionIndex));
	};

	const stepList = actions.map((step: iAction, index: number) => {
		return (
			<Action
				onDelete={handleDeleteAction}
				style={{ marginTop: index === 0 ? 0 : stepStyle.marginTop }}
				key={index}
				index={index}
				action={step}
			/>
		);
	});

	return (
		<div className="h-full" style={containerStyle} id="stepsListContainer">
			<ul style={stepsListContainerStyle} className="margin-list-item">
				{stepList}
			</ul>
		</div>
	);
};

const containerStyle = {
	height: "auto",
	maxHeight: 290,
	minHeight: 100,
	overflowY: OVERFLOW.SCROLL,
	marginBottom: "0.4rem",
	scrollBehavior: SCROLL_BEHAVIOR.SMOOTH,
};

const stepsListContainerStyle = {
//	padding: "1.1rem 1.25rem",
	position: POSITION.RELATIVE,
	marginTop: "-0.55rem",
	borderTopLeftRadius: "12px",
	overflow: OVERFLOW.AUTO,
};

const stepStyle = {
	display: "flex",
	cursor: "pointer",
	fontFamily: "DM Sans",
	fontStyle: "normal",
	//	background: "#1C1F26",
	borderRadius: "0.25rem",
	position: POSITION.RELATIVE,
	padding: "0.6rem",
	marginTop: "1rem",
	overflow: "hidden",
};

const stepImageStyle = {
	flex: 0.1,
	padding: "0 0.9rem",
};

const stepActionStyle = {
	fontWeight: FONT_WEIGHT.BOLD,
	color: "#8C8C8C",
	fontSize: "0.8rem",
};

const stepSelectorContainerStyle = {
	overflow: OVERFLOW.HIDDEN,
	position: POSITION.RELATIVE,
};
const stepSelectorStyle = {
	marginTop: "0.25rem",
	color: "#8C8C8C",
	fontSize: "0.6rem",
	whiteSpace: WHITE_SPACE.NOWRAP,
	width: "70%",
	overflow: "hidden",
};
const stepIndexNumberingStyle = {
	position: POSITION.ABSOLUTE,
	color: "#485264",
	fontFamily: "DM Sans",
	fontSize: "0.75rem",
	fontStyle: "normal",
	fontWeight: FONT_WEIGHT.BOLD,
	bottom: "0.375rem",
	left: "1.875rem",
};

export { ActionStepList };
