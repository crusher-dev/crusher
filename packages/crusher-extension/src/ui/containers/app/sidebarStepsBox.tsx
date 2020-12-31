import React from "react";
import {
	FLEX_DIRECTION,
	FONT_WEIGHT,
	OVERFLOW,
	POSITION,
} from "../../../interfaces/css";
import { ActionStepList, iStep } from "./actionStepList";

interface iSidebarStepsBoxProps {
	steps: Array<iStep>;
}

const SidebarStepsBox = (props: iSidebarStepsBoxProps) => {
	const { steps } = props;

	return (
		<div style={sidebarStyle}>
			<div style={tipContainerStyle}>
				<div>
					<img src="/icons/bulb.svg" width={31} />
				</div>
				<div style={tipContentStyle}>
					<div style={tipTitleStyle}>Tip of the session</div>
					<div style={tipDescStyle}>Click on play to replay selected test</div>
				</div>
			</div>
			<div style={mainContainerStyle}>
				<div style={stepsContainerStyle}>
					<ActionStepList steps={steps} />
				</div>
				<div style={actionContainerStyle}>
					{/*<ActionContainer*/}
					{/*	state={state}*/}
					{/*	updateState={updateState}*/}
					{/*	iframeRef={iframeRef}*/}
					{/*	isShowingElementForm={isShowingElementForm}*/}
					{/*	setIsShowingElementForm={setIsShowingElementForm}*/}
					{/*/>*/}
				</div>
			</div>
		</div>
	);
};

const sidebarStyle = {
	display: "flex",
	flexDirection: FLEX_DIRECTION.COLUMN,
	position: POSITION.FIXED,
	bottom: "0",
	right: "0%",
	marginLeft: "auto",
	maxHeight: "85vh",
	maxWidth: "22rem",
	borderTopLeftRadius: 20,
	width: "25vw",
};

const tipContainerStyle = {
	display: "flex",
	flexDirection: FLEX_DIRECTION.ROW,
	background: "rgb(1, 1, 1)",
	borderRadius: "0.62rem 0 0 0",
	padding: "0.88rem 1.63rem",
};

const tipContentStyle = {
	color: "#FFFFFF",
	fontFamily: "DM Sans",
	marginLeft: "0.898rem",
};

const tipTitleStyle = {
	color: "#FFFFFF",
	fontFamily: "DM Sans",
	marginLeft: "0.898rem",
};

const tipDescStyle = {
	fontSize: "0.66rem",
	fontWeight: FONT_WEIGHT.BOLD,
};

const mainContainerStyle = {
	borderTopLeftRadius: 12,
	background: "#14181F",
};

const stepsContainerStyle = {
	padding: "0rem 1.25rem",
	paddingBottom: "0rem",
	borderTopLeftRadius: 12,
};

const actionContainerStyle = {
	padding: "1.1rem 1.25rem",
	position: POSITION.RELATIVE,
	background: "#1C1F26",
	marginTop: "-0.55rem",
	borderTopLeftRadius: "12px",
	overflow: OVERFLOW.AUTO,
};

export { SidebarStepsBox };
