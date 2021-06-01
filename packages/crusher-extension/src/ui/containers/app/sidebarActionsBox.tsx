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
import { BlueButton } from "../../components/app/BlueButton";
import { divide } from "lodash";

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
		<div className="flex flex-col pt-72 items-center justify-center h-full">
			<DetectActionSwitch />
			<div className="mt-4  flex flex-col items-center pb-100">
				<div
					className="text-white
				font-semibold mt-28
				text-center text-15 mb-12"
				>
					We're detecting your basic actions
				</div>
				<h6 className="text-gray-300 text-center text-13">
					For manual control, you can add custom checks
				</h6>
				<BlueButton
					className="mt-24"
					onClick={toggleCustomIsCheck}
					title="Add custom check"
				/>
				<a
					href="https://www.google.com"
					className="underline text-gray-500 text-12 mt-44"
				>
					Which actions are automatically detected?
				</a>
			</div>
		</div>
	);

	const [isSearching, setIsSearching] = useState(false);
	const toggleSearching = () => setIsSearching(!isSearching);
	return (
		<div style={sidebarStyle} className="flex flex-col h-screen pt-2">
			<div
				className={`flex h-20 
			${!isCustomCheck ? "justify-end" : "justify-center"} 
			items-center`}
			>
				{!isCustomCheck ? (
					<div className="mr-28 cursor-pointer">
						<SettingsIcon />
					</div>
				) : (
					<div className="flex items-center text-white h-10 max-w-max">
						<DetectActionSwitch />
						<div className="pl-1">
							{isAutoHoverOn ? "Detecting Actions" : "Not Detecting Actions"}
						</div>
					</div>
				)}
			</div>
			<div
				style={{ height: "55%" }}
				className="flex mt-1 flex-col 
				  border-b-2 
				  p-24   border-gray-800"
			>
				{!isSearching ? (
					<div className="flex justify-between items-center">
						<h5
							className="text-white font-semibold 
						text-md text-17"
						>
							Actions
						</h5>
						{isCustomCheck && (
							<SearchIcon className="cursor-pointer mr-2" onClick={toggleSearching} />
						)}
					</div>
				) : (
					<div className="flex">
						<InputField style={{ width: "80%" }} placeholder="Search an Action" />
						<div
							onClick={toggleSearching}
							style={{ width: "20%" }}
							className="h-full text-white text-17 
							 cursor-pointer flex items-center justify-center"
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

			<ActionStepList />
		</div>
	);
};

const sidebarStyle = {
	background: COLOR_CONSTANTS.PRIMARY,
	width: "22%",
};

const mainContainerStyle = {
	maxHeight: "80vh",
	overflow: OVERFLOW.AUTO,
};

const actionContainerStyle = {
	position: POSITION.RELATIVE,
	marginTop: "1rem",
	overflow: OVERFLOW.AUTO,
};

export { SidebarActionsBox };
