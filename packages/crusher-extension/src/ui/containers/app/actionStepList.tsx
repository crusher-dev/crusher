import React, { useEffect } from "react";
import {
	FONT_WEIGHT,
	OVERFLOW,
	POSITION,
	SCROLL_BEHAVIOR,
	WHITE_SPACE,
} from "../../../interfaces/css";
import { ACTIONS_IN_TEST } from "../../../../../crusher-shared/constants/recordedActions";
import { iAction } from "../../../interfaces/actionsReducer";

interface iActionProps {
	action: iAction;
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

const Action = (props: iActionProps) => {
	const { action } = props;

	return (
		<li style={stepStyle}>
			<div style={stepImageStyle}>
				<img src={chrome.runtime.getURL("icons/mouse.svg")} />
			</div>
			<div>
				<div style={stepActionStyle}>{action.type}</div>
				<div style={stepSelectorContainerStyle}>
					<div style={stepSelectorStyle}>{getActionDescription(action)}</div>
				</div>
			</div>
		</li>
	);
};

interface iActionStepListProps {
	items: Array<iAction>;
}

const ActionStepList = (props: iActionStepListProps) => {
	const { items } = props;

	useEffect(() => {
		const testListContainer: any = document.querySelector("#stepsListContainer");
		const elementHeight = testListContainer.scrollHeight;
		testListContainer.scrollBy(0, elementHeight);
	});

	const stepList = items.map((step: iAction, index: number) => {
		return <Action key={index} action={step} />;
	});

	return (
		<div style={containerStyle} id="stepsListContainer">
			<ul style={stepsListContainerStyle} className="margin-list-item">
				{stepList}
			</ul>
		</div>
	);
};

const containerStyle = {
	height: "auto",
	maxHeight: 240,
	minHeight: 100,
	overflowY: OVERFLOW.AUTO,
	marginBottom: "0.5rem",
	scrollBehavior: SCROLL_BEHAVIOR.SMOOTH,
};

const stepsListContainerStyle = {
	padding: "1.1rem 1.25rem",
	position: POSITION.RELATIVE,
	background: "#1C1F26",
	marginTop: "-0.55rem",
	borderTopLeftRadius: "12px",
	overflow: OVERFLOW.AUTO,
};

const stepStyle = {
	display: "flex",
	cursor: "pointer",
	fontFamily: "DM Sans",
	fontStyle: "normal",
	background: "#1C1F26",
	borderRadius: "0.25rem",
	padding: "0.6rem 0",
	overflow: "hidden",
};

const stepImageStyle = {
	padding: "0 0.9rem",
};

const stepActionStyle = {
	fontWeight: FONT_WEIGHT.BOLD,
	color: "#8C8C8C",
	fontSize: "0.8rem",
};

const stepSelectorContainerStyle = {
	overflow: "hidden",
};
const stepSelectorStyle = {
	marginTop: "0.25rem",
	color: "#8C8C8C",
	fontSize: "0.6rem",
	whiteSpace: WHITE_SPACE.NOWRAP,
};

export { ActionStepList };
