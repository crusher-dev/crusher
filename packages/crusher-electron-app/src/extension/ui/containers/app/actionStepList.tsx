import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { FONT_WEIGHT, OVERFLOW, POSITION, SCROLL_BEHAVIOR, WHITE_SPACE } from "../../../interfaces/css";
import { ActionsInTestEnum, ElementActionsInTestArr, ACTIONS_TO_LABEL_MAP } from "@shared/constants/recordedActions";
import { ActionStatusEnum, iAction } from "@shared/types/action";
import { useSelector } from "react-redux";
import { getActions } from "../../../redux/selectors/actions";
import { getStore } from "../../../redux/store";
import { deleteRecordedAction, updateActionName, updateActionTimeout } from "../../../redux/actions/actions";
import { Conditional } from "../../components/conditional";
import { COLOR_CONSTANTS } from "../../colorConstants";
import { BlueButton } from "../../components/app/BlueButton";
import { FailureIcon, LoadingIcon } from "crusher-electron-app/src/extension/assets/icons";

interface iActionProps {
	action: iAction;
	onDelete: (actionIndex: number) => void;
	onClick?: any;
	index: number;
	style?: React.CSSProperties;
}
interface IStepInfoEditBoxProps {
	stepIndex: number;
	step: iAction;
	closeEditBox: any;
}

function StepInfoEditBox(props: IStepInfoEditBoxProps) {
	const ref = useRef(null);
	const { closeEditBox } = props;
	const [stepName, setStepName] = useState(props.step.name);
	const [stepTimeout, setStepTimeout] = useState(
		props.step && props.step.payload && typeof props.step.payload.timeout !== "undefined" ? props.step.payload.timeout.toString() : "15",
	);

	useEffect(() => {
		document.body.addEventListener(
			"click",
			(event: MouseEvent) => {
				if (event.target !== ref.current && ref.current && !ref.current.contains(event.target)) {
					closeEditBox();
				}
			},
			true,
		);
	}, [ref]);

	const handleStepNameInputChange = (event) => {
		setStepName(event.target.value);
	};

	const isElementAction = props.step && ElementActionsInTestArr.includes(props.step.type);

	const saveTest = useCallback(
		(event) => {
			const store = getStore();
			store.dispatch(updateActionName(stepName, props.stepIndex));
			if (isElementAction) store.dispatch(updateActionTimeout(parseInt(stepTimeout), props.stepIndex));
			closeEditBox();
		},
		[stepName, stepTimeout, isElementAction],
	);

	const handleTimeoutChange = (event: ChangeEvent) => {
		setStepTimeout((event.target as any).value);
	};

	return (
		<div ref={ref} style={{ display: "flex", flexDirection: "column", color: "#FFFFFF", padding: "25px 22px" }}>
			<label style={{ fontFamily: "inherit", fontSize: 14, fontWeight: 500 }}>Step name</label>
			<input
				style={{
					marginTop: 5,
					borderRadius: 4,
					padding: "7px 10px",
					fontSize: 12,
					outline: "none",
					background: "rgba(196, 196, 196, 0.02)",
					border: "1px solid rgba(196, 196, 196, 0.2)",
				}}
				placeholder={"Enter step name"}
				value={stepName}
				onChange={handleStepNameInputChange}
				type="text"
			/>

			<Conditional If={props.step.screenshot}>
				<div style={{ marginTop: 18, background: "#191E1E", borderRadius: 4, height: 130, width: 286 }}>
					<img src={props.step.screenshot} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
				</div>
			</Conditional>
			<Conditional If={isElementAction}>
				<div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: 24 }}>
					<label style={{ fontSize: 13 }}>Timeout (sec)</label>
					<input
						type="text"
						pattern="[0-9]*"
						style={{
							marginLeft: "auto",
							width: 82,
							height: 27,
							fontSize: 12,
							padding: "7px 10px",
							borderRadius: 4,
							background: "rgba(196, 196, 196, 0.02)",
							border: "1px solid rgba(196, 196, 196, 0.2)",
							outline: "none",
						}}
						onChange={handleTimeoutChange}
						defaultValue={stepTimeout}
					></input>
				</div>
			</Conditional>
			<div style={{ display: "flex", flexDirection: "row", marginTop: 2, justifyContent: "flex-end" }}>
				<BlueButton
					onClick={saveTest}
					className="mt-24"
					style={{ fontSize: 14, fontWeight: 500, paddingTop: 4, paddingBottom: 4, borderRadius: 4 }}
					title="Save"
				/>
			</div>
		</div>
	);
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
	const { action, index, onDelete, onClick } = props;

	const handleDelete = (event) => {
		event.stopPropagation();
		onDelete(index);
	};

	const isDefaultAction = index < 2;

	return (
		<li style={stepStyle} className="mt-20" onClick={onClick}>
			<div style={stepImageStyle}>
				<img src={chrome.runtime.getURL(ICONS[action.type] ? ICONS[action.type] : "icons/mouse.svg")} />
			</div>
			<div style={actionItemTextContainer}>
				<div className="text-13" style={stepActionStyle}>
					{action.name ? action.name : ACTIONS_TO_LABEL_MAP[action.type]}
					{action.payload && action.payload.timeout ? ` (${action.payload.timeout}s)` : ""}
				</div>
				<div style={stepSelectorContainerStyle}>
					<div className="text-12" style={stepSelectorStyle}>
						{getActionDescription(action)}
					</div>
				</div>
			</div>
			<Conditional If={action.status && action.status === ActionStatusEnum.STARTED}>
				<div style={deleteIconContainerStyle}>
						<LoadingIcon style={{width: 30, height: 30}} />
				</div>
			</Conditional>

			<Conditional If={action.status && action.status === ActionStatusEnum.FAILURE}>
				<div style={deleteIconContainerStyle}>
						<FailureIcon style={{width: 30, height: 30}} />
				</div>
			</Conditional>

			<Conditional If={!isDefaultAction && action.status && action.status === ActionStatusEnum.SUCCESS}>
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
	width: 13,
};

const ActionStepList = () => {
	const actions = useSelector(getActions);
	const [stepInfoBoxState, setStepInfoBoxState] = useState({ enabled: false, step: null, stepIndex: -1 });

	useEffect(() => {
		const testListContainer: any = document.querySelector("#stepsListContainer");
		const elementHeight = testListContainer.scrollHeight;
		testListContainer.scrollBy(0, elementHeight);
	}, [actions.length]);

	const handleDeleteAction = (actionIndex: number) => {
		const store = getStore();
		store.dispatch(deleteRecordedAction(actionIndex));
	};

	const handleActionClick = (step: iAction, stepIndex: number) => {
		setStepInfoBoxState({ enabled: true, step: step, stepIndex: stepIndex });
	};

	const stepList = actions.map((step: iAction, index: number) => {
		return (
			<Action
				onClick={handleActionClick.bind(this, step, index)}
				onDelete={handleDeleteAction}
				style={{ marginTop: index === 0 ? 0 : stepStyle.marginTop }}
				key={index}
				index={index}
				action={step}
			/>
		);
	});

	const handleStepInfoBoxOutsideClick = () => {
		setStepInfoBoxState({ enabled: false, step: null, stepIndex: -1 });
	};

	const isCurrentElementAction = stepInfoBoxState.step && ElementActionsInTestArr.includes(stepInfoBoxState.step.type);

	return (
		<div className="flex flex-col p-24" style={{ height: "45%", position: "relative" }}>
			<Conditional If={stepInfoBoxState.enabled}>
				<div style={actionEditInfoContainerStyle(stepInfoBoxState.step && !!(stepInfoBoxState.step as iAction).screenshot, isCurrentElementAction)}>
					<StepInfoEditBox step={stepInfoBoxState.step} stepIndex={stepInfoBoxState.stepIndex} closeEditBox={handleStepInfoBoxOutsideClick} />
				</div>
			</Conditional>
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

const actionEditInfoContainerStyle = (isScreenshotOn: boolean, isElementAction: boolean) => {
	let offset = 0;
	if (isElementAction) offset += 40;

	return {
		position: POSITION.ABSOLUTE,
		left: -354,
		top: isScreenshotOn ? -45 : 0,
		width: 334,
		height: isScreenshotOn ? 332 + offset : 172 + offset,
		border: "1px solid #272727",
		borderRadius: 12,
		background: "#111213",
		zIndex: 99,
	};
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
