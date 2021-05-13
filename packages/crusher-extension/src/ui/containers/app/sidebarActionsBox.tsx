import React, { RefObject, useEffect, useState, ChangeEvent } from "react";
import { ActionStepList } from "./actionStepList";
import { useSelector } from "react-redux";
import {
	getActionsRecordingState,
	getAutoRecorderState,
} from "../../../redux/selectors/recorder";
import { Conditional } from "../../components/conditional";
import { ACTIONS_RECORDING_STATE } from "../../../interfaces/actionsRecordingState";
import { TopLevelActionsList } from "./topLevelActionsList";
import { ElementLevelActionsList } from "./elementLevelActionsList";
import {
	OVERFLOW,
	POSITION,
} from "../../../interfaces/css";
import { SelectElementPlaceholder } from "./selectElementPlaceholder";
import { SwitchOffIcon, SwitchOnIcon } from "../../../assets/icons";
import { getStore } from "../../../redux/store";
import { updateAutoRecorderSetting } from "../../../redux/actions/recorder";
import { COLOR_CONSTANTS } from "../../colorConstants";

interface iSidebarActionBoxProps {
	deviceIframeRef: RefObject<HTMLIFrameElement>;
}

const TIPS = [
	"Click on toggle to select element using inspector",
	"Generate quick seo checks by clicking on auto generate",
	"Right click on the element to turn on inspector mode",
	"Use custom script for complex checks",
	"Blackout an element to avoid running visual checks against that element",
	"Hover mouse for 2s to record hover on an element",
	"Remember to record hover if the next actions are dependent on it",
];

const SidebarActionsBox = (props: iSidebarActionBoxProps) => {
	const recordingState = useSelector(getActionsRecordingState);
	const [currentTip, setCurrentTip] = useState(TIPS[0]);

	useEffect(() => {
		const newTipIndex = Math.floor(Math.random() * (TIPS.length - 1 - 0 + 1)) + 0;
		setCurrentTip(TIPS[newTipIndex]);
	}, []);

	const handleAutoDetectModeToggle = (event: ChangeEvent<HTMLInputElement>) => {
		const store = getStore();
		store.dispatch(updateAutoRecorderSetting(event.target.checked));
	};

	const isAutoHoverOn = useSelector(getAutoRecorderState);

	return (
		<div style={sidebarStyle} className="flex flex-col h-screen">
			<div className="flex flex-col  h-1/2">
				<h5 className="text-white">Actions</h5>
				<div className="flex flex-col items-center justify-center h-full">
					<div>
						<label className="switch cursor-pointer">
							<input
								type="checkbox"
								defaultChecked={isAutoHoverOn}
								onChange={handleAutoDetectModeToggle}
							/>
							{/* <span className="slider round"></span> */}
							{isAutoHoverOn ? <SwitchOnIcon /> : <SwitchOffIcon />}
						</label>
					</div>

					<div className="mt-4 ml-5 mr-5">
						<h5 className="text-white text-center">
							We're detecting your basic actions
						</h5>
						<h6 className="text-gray-300 text-center">
							For manual control, you can add custom checks
						</h6>
					</div>
				</div>
			</div>
			<div style={mainContainerStyle}>
				<div style={stepsContainerStyle}>
					<ActionStepList />
				</div>
				<div style={actionContainerStyle}>
					<Conditional
						If={recordingState.type === ACTIONS_RECORDING_STATE.SELECT_ELEMENT}
					>
						<SelectElementPlaceholder deviceIframeRef={props.deviceIframeRef} />
					</Conditional>
					<Conditional If={recordingState.type === ACTIONS_RECORDING_STATE.PAGE}>
						<TopLevelActionsList deviceIframeRef={props.deviceIframeRef} />
					</Conditional>
					<Conditional If={recordingState.type === ACTIONS_RECORDING_STATE.ELEMENT}>
						<ElementLevelActionsList deviceIframeRef={props.deviceIframeRef} />
					</Conditional>
				</div>
			</div>
		</div>
	);
};

const sidebarStyle = {
	background: COLOR_CONSTANTS.PRIMARY,
	maxWidth: "22rem",
	width: "25vw",
};

const mainContainerStyle = {
	borderTopLeftRadius: 12,
	background: "#14181F",
	maxHeight: "80vh",
	overflow: "auto",
};

const stepsContainerStyle = {
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

export { SidebarActionsBox };
