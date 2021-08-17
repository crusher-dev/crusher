import React, { useEffect } from "react";
import { FONT_WEIGHT, OVERFLOW, POSITION, SCROLL_BEHAVIOR, WHITE_SPACE } from "../../../interfaces/css";
import { ActionsInTestEnum, ACTIONS_TO_LABEL_MAP } from "@shared/constants/recordedActions";
import { iAction } from "@shared/types/action";
import { useSelector } from "react-redux";
import { getActions } from "../../../redux/selectors/actions";
import { getStore } from "../../../redux/store";
import { deleteRecordedAction } from "../../../redux/actions/actions";
import { Conditional } from "../../components/conditional";
import { COLOR_CONSTANTS } from "../../colorConstants";

interface iActionProps {
	action: iAction;
	onDelete: (actionIndex: number) => void;
	index: number;
	style?: React.CSSProperties;
}

function getActionDescription(action: iAction) {
	if (action.type === ActionsInTestEnum.PAGE_SCROLL || action.type === ActionsInTestEnum.ELEMENT_SCROLL) {
		return "Performing scroll";
	}

	if (action.payload.selectors && action.payload.selectors[0]) {
		return action.payload.selectors[0].value;
	}

	return "Unknown Action";
}

const ICONS = {
	[ActionsInTestEnum.SET_DEVICE as ActionsInTestEnum]: "/icons/actions/set-device.svg",
	[ActionsInTestEnum.NAVIGATE_URL as ActionsInTestEnum]: "/icons/actions/navigate.svg",
	[ActionsInTestEnum.CLICK as ActionsInTestEnum]: "/icons/actions/click.svg",
	[ActionsInTestEnum.HOVER as ActionsInTestEnum]: "/icons/actions/hover.svg",
	[ActionsInTestEnum.ELEMENT_SCREENSHOT as ActionsInTestEnum]: "/icons/actions/screenshot.svg",
	[ActionsInTestEnum.PAGE_SCREENSHOT as ActionsInTestEnum]: "/icons/actions/screenshot.svg",
	[ActionsInTestEnum.VALIDATE_SEO as ActionsInTestEnum]: "/icons/actions/seo.svg",
	[ActionsInTestEnum.BLACKOUT as ActionsInTestEnum]: "icons/actions/blackout.svg",
	[ActionsInTestEnum.CUSTOM_ELEMENT_SCRIPT as ActionsInTestEnum]: "icons/actions/custom-script.svg",
	[ActionsInTestEnum.ASSERT_ELEMENT as ActionsInTestEnum]: "icons/actions/assert-modal.svg",
	[ActionsInTestEnum.ELEMENT_FOCUS as ActionsInTestEnum]: "icons/actions/click.svg",
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
					{ACTIONS_TO_LABEL_MAP[action.type]}
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
				<h5 className="font-semibold text-17">Recorded steps</h5>
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
