import React, { useEffect } from "react";
import { FONT_WEIGHT, OVERFLOW, POSITION, SCROLL_BEHAVIOR, WHITE_SPACE } from "../../../interfaces/css";
import { ACTIONS_IN_TEST } from "../../../../../crusher-shared/constants/recordedActions";
import { iAction } from "../../../../../crusher-shared/types/action";
import { useSelector } from "react-redux";
import { getActions } from "../../../redux/selectors/actions";
import { getStore } from "../../../redux/store";
import { deleteRecordedAction } from "../../../redux/actions/actions";
import { Conditional } from "../../components/conditional";
import { COLOR_CONSTANTS } from "../../../ui/colorConstants";

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
		<li style={stepStyle} className="mt-20">
			<div style={stepImageStyle}>
				<img src={chrome.runtime.getURL(ICONS[action.type] ? ICONS[action.type] : "icons/mouse.svg")} />
			</div>
			<div style={actionItemTextContainer}>
				<div className="text-13" style={stepActionStyle}>
					{action.type}
				</div>
				<div style={stepSelectorContainerStyle}>
					<div className="text-12" style={stepSelectorStyle}>
						{getActionDescription(action)}
					</div>
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
		return <Action onDelete={handleDeleteAction} style={{ marginTop: index === 0 ? 0 : stepStyle.marginTop }} key={index} index={index} action={step} />;
	});

	return (
		<div className="flex flex-col p-24" style={{ height: "45%" }}>
			<div className="flex justify-between text-white">
				<h5 className="font-semibold text-17">Recorded</h5>
				<div
					className="text-13 text-center
					flex items-center justify-center
					px-12 py-4 bg-gray-800 rounded-md
					cursor-pointer"
				>
					{stepList.length} steps
				</div>
			</div>
			<div className="h-full mt-12" style={containerStyle} id="stepsListContainer">
				<div className="absolute inset-0">
					<div style={lineStyle}></div>
				</div>
				<ul style={stepsListContainerStyle} className="margin-list-item">
					{stepList}
				</ul>
			</div>
		</div>
	);
};

const lineStyle = {
	position: POSITION.FIXED,
	width: "2px",
	backgroundColor: COLOR_CONSTANTS.BORDER,
	height: "30%",
	marginTop: "1rem",
	marginLeft: "1.44rem",
};

const containerStyle = {
	position: POSITION.RELATIVE,
	height: "auto",
	maxHeight: 290,
	minHeight: 100,
	overflowY: OVERFLOW.SCROLL,
	marginBottom: "0.4rem",
	scrollBehavior: SCROLL_BEHAVIOR.SMOOTH,
};

const stepsListContainerStyle = {
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
	borderRadius: "0.25rem",
	position: POSITION.RELATIVE,
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

export { ActionStepList };
