import React, { useEffect } from "react";
import {
	FONT_WEIGHT,
	OVERFLOW,
	POSITION,
	SCROLL_BEHAVIOR,
	WHITE_SPACE,
} from "../../../interfaces/css";
import { ACTIONS_IN_TEST } from "../../../../../crusher-shared/constants/recordedActions";

export interface iStep {
	event_type: string;
	selectors: Array<{
		value: string;
	}>;
	value: string;
}

interface iStepProps {
	step: iStep;
}

const Step = (props: iStepProps) => {
	const { step } = props;

	const stepValue =
		step.event_type === ACTIONS_IN_TEST.SCROLL ? "Performing scroll" : step.value;

	return (
		<li style={stepStyle}>
			<div style={stepImageStyle}>
				<img src={chrome.runtime.getURL("icons/mouse.svg")} />
			</div>
			<div>
				<div style={stepActionStyle}>{step.event_type}</div>
				<div style={stepSelectorContainerStyle}>
					<div style={stepSelectorStyle}>{stepValue || step.selectors[0].value}</div>
				</div>
			</div>
		</li>
	);
};

interface iActionStepListProps {
	steps: Array<iStep>;
}

const ActionStepList = (props: iActionStepListProps) => {
	const { steps } = props;

	useEffect(() => {
		const testListContainer: any = document.querySelector("#stepsListContainer");
		const elementHeight = testListContainer.scrollHeight;
		testListContainer.scrollBy(0, elementHeight);
	});

	const stepList = steps.map((step: any, index: number) => {
		return <Step key={index} step={step} />;
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
