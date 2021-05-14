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
import { OVERFLOW, POSITION } from "../../../interfaces/css";
import { SelectElementPlaceholder } from "./selectElementPlaceholder";
import {
	SearchIcon,
	SettingsIcon,
	SwitchOffIcon,
	SwitchOnIcon,
} from "../../../assets/icons";
import { getStore } from "../../../redux/store";
import { updateAutoRecorderSetting } from "../../../redux/actions/recorder";
import { COLOR_CONSTANTS } from "../../colorConstants";
import InputField from "../../components/app/InputField";

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

	const [isCustomCheck, setIsCustomCheck] = useState(false);
	const toggleCustomIsCheck = () => setIsCustomCheck(!isCustomCheck);

	const DetectActionSwitch = () => (
		<div>
			<label className="switch cursor-pointer">
				<input
					type="checkbox"
					defaultChecked={isAutoHoverOn}
					onChange={handleAutoDetectModeToggle}
				/>
				{isAutoHoverOn ? <SwitchOnIcon /> : <SwitchOffIcon />}
			</label>
		</div>
	);
	const AddCustomCheckView = () => (
		<div className="flex flex-col items-center justify-center h-full">
			<DetectActionSwitch />
			<div className="mt-4 ml-5 mr-5 flex flex-col items-center">
				<h5 className="text-white text-center">
					We're detecting your basic actions
				</h5>
				<h6 className="text-gray-300 text-center text-sm">
					For manual control, you can add custom checks
				</h6>
				<button
					onClick={toggleCustomIsCheck}
					className="p-2 focus:outline-nmainContainerStyleone pr-5 pl-5 
				max-w-max mt-4 rounded-md bg-blue-400 text-white"
				>
					Add custom check
				</button>
				<a
					href="https://www.google.com"
					className="underline text-gray-500 text-sm mt-5"
				>
					which actions are automatically detected?
				</a>
			</div>
		</div>
	);

	const [isSearching, setIsSearching] = useState(false);
	const toggleSearching = () => setIsSearching(!isSearching);
	return (
		<div style={sidebarStyle} className="flex flex-col h-screen">
			<div
				className={`flex h-16 
			${!isCustomCheck ? "justify-end" : "justify-center"} 
			items-center`}
			>
				{!isCustomCheck ? (
					<div className="mr-5 cursor-pointer">
						<SettingsIcon />
					</div>
				) : (
					<div className="flex text-white">
						<DetectActionSwitch />
						{isAutoHoverOn ? "Detecting Actions" : "Not Detecting Actions"}
					</div>
				)}
			</div>
			<div className="flex h-1/2 mt-1 flex-col p-2 border-b-2 border-gray-800">
				{!isSearching ? (
					<div className="flex justify-between">
						<h5 className="text-white">Actions</h5>
						{isCustomCheck && (
							<SearchIcon className="cursor-pointer" onClick={toggleSearching} />
						)}
					</div>
				) : (
					<div className="flex justify-between">
						<InputField placeholder="Search an Action" />
						<div
							onClick={toggleSearching}
							className="h-full mr-6 text-white text-3xl 
							 cursor-pointer"
						>
							&times;
						</div>
					</div>
				)}

				{!isCustomCheck ? (
					<AddCustomCheckView />
				) : (
					<div style={mainContainerStyle}>
						<div style={actionContainerStyle}>
							<Conditional
								If={recordingState.type === ACTIONS_RECORDING_STATE.SELECT_ELEMENT}
							>
								<SelectElementPlaceholder deviceIframeRef={props.deviceIframeRef} />
							</Conditional>
							<Conditional If={recordingState.type === ACTIONS_RECORDING_STATE.PAGE}>
								<TopLevelActionsList deviceIframeRef={props.deviceIframeRef} />
							</Conditional>
							<Conditional
								If={recordingState.type === ACTIONS_RECORDING_STATE.ELEMENT}
							>
								<ElementLevelActionsList deviceIframeRef={props.deviceIframeRef} />
							</Conditional>
						</div>
					</div>
				)}
			</div>

			<div className="flex flex-col">
				<div className="flex justify-between text-white p-3">
					<h5>Recorded</h5>
					<div className="text-sm text-center pr-2 pl-2 bg-gray-800 rounded-md">
						11 steps
					</div>
				</div>
				<ActionStepList />
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
	//	borderTopLeftRadius: 12,
	//background: "#14181F",
	maxHeight: "80vh",
	// overflow: "auto",
};

// const stepsContainerStyle = {
// 	paddingBottom: "0rem",
// 	borderTopLeftRadius: 12,
// };

const actionContainerStyle = {
	padding: "1.1rem 1.25rem",
	position: POSITION.RELATIVE,
	//background: "#1C1F26",
	marginTop: "-0.55rem",
	borderTopLeftRadius: "12px",
	overflow: OVERFLOW.AUTO,
};

export { SidebarActionsBox };
