import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { FONT_WEIGHT, OVERFLOW, POSITION, SCROLL_BEHAVIOR, WHITE_SPACE } from "../../../interfaces/css";
import { ActionsInTestEnum, ElementActionsInTestArr, ACTIONS_TO_LABEL_MAP } from "@shared/constants/recordedActions";
import { ActionStatusEnum, iAction } from "@shared/types/action";
import { useSelector } from "react-redux";
import { getActions, getSelectedActions } from "../../../redux/selectors/actions";
import { getStore } from "../../../redux/store";
import { deleteRecordedAction, setRecordedActions, updateActionName, updateActionTimeout, updateSelectedActions } from "../../../redux/actions/actions";
import { COLOR_CONSTANTS } from "../../colorConstants";
import { BlueButton } from "../../components/app/BlueButton";
import { AddIcon, FailureIcon, LoadingIcon, MoreIcon, PassedIcon } from "crusher-electron-app/src/extension/assets/icons";
import { Checkbox } from "../../components/app/checkbox";
import { Action } from "./actionStep";
import { Conditional } from "../../components/conditional";
import { CreateTemplatesModal } from "./modals/createTemplateModal";

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

const ActionStepList = () => {
	const actions = useSelector(getActions);
	const [stepInfoBoxState, setStepInfoBoxState] = useState({ enabled: false, step: null, stepIndex: -1 });
	const selectedActions = useSelector(getSelectedActions);
	const [showCreateModal, setShowCreateModal] = useState(false);

	const showTemplateCreateButton = selectedActions.length;

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
				style={{ marginTop: "3rem" }}
				key={index}
				index={index}
				action={step}
			/>
		);
	});

	const handleStepInfoBoxOutsideClick = () => {
		setStepInfoBoxState({ enabled: false, step: null, stepIndex: -1 });
	};

	const handleSelectAllCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = event.target.checked;
		const elements: Array<HTMLInputElement> = Array.from(document.querySelectorAll("#selectedSteps"));
		const store = getStore();

		elements.forEach((element) => {
			element.checked = isChecked;
		});

		if (isChecked) {
			const selectedActionIds = elements
				.filter((checkbox: HTMLInputElement) => checkbox.checked)
				.map((checkbox: HTMLInputElement) => {
					return { id: checkbox.getAttribute("data-id") };
				});
			store.dispatch(updateSelectedActions(selectedActionIds));
		} else {
			store.dispatch(updateSelectedActions([]));
		}
	};

	const handleAddTemplate = (event: MouseEvent) => {
		setShowCreateModal(true);
	};

	const handleTemplateModalSubmit = (name: string) => {
		setShowCreateModal(false);
		if (!name) return;

		const store = getStore();
		let actions = getActions(store.getState());
		const selectedActionRecords = getSelectedActions(store.getState());
		if (!selectedActionRecords) return;

		const selectedActionsIdArr = selectedActionRecords.map((action) => {
			return action.id;
		});
		const selectedActions = actions
			.map((action, index) => {
				return { id: index, action: action };
			})
			.filter((_, index) => {
				return selectedActionsIdArr.includes(index.toString());
			})
			.sort((a, b) => {
				return a.id - b.id;
			});

		if (selectedActions.length) {
			const templateAction: iAction = {
				type: ActionsInTestEnum.RUN_TEMPLATE,
				name: name,
				payload: {
					meta: {
						actions: selectedActions.map((actionData) => actionData.action),
					},
				},
			};

			for (const selectedAction of selectedActions) {
				delete actions[selectedAction.id];
			}

			actions[selectedActions[0].id] = templateAction;
			actions = actions.filter((action) => !!action);
			store.dispatch(setRecordedActions(actions));
		}

		const clearSelectedActions = () => {
			store.dispatch(updateSelectedActions([]));
			const elements: Array<HTMLInputElement> = Array.from(document.querySelectorAll("#selectedSteps"));
			elements.forEach((element) => {
				element.checked = false;
			});

			(document.querySelector("#selectAllSteps") as HTMLInputElement).checked = false;
		};

		clearSelectedActions();
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
				<div className={"flex"} style={{ alignItems: "center", flex: 1 }}>
					<Checkbox onChange={handleSelectAllCheckboxChange} id={"selectAllSteps"} labelText={`${stepList.length} steps`} />
					{/* <div
						className="text-15 text-center
					flex items-center justify-center
					px-12 py-4
					cursor-pointer"
						style={{
							color: "#FFFFFF",
							borderRadius: 4,
							backgroundColor: "rgba(196, 196, 196, 0.02",
							border: "1px solid rgba(196, 196, 196, 0.2)",
							padding: "5px 6px",
							marginLeft: 12,
						}}
					>
						<MoreIcon />
					</div> */}
				</div>
				{/* <Conditional If={!showTemplateCreateButton}>
					<div
						className="text-15 text-center
					flex items-center justify-center
					px-12 py-4
					cursor-pointer"
						style={{ color: "#FFFFFF" }}
					>
						<PassedIcon style={{ width: 15, height: 15 }} />
						<span style={{ marginLeft: 12 }}>Context</span>
					</div>
				</Conditional> */}
				<Conditional If={showTemplateCreateButton}>
					<div
						className="text-15 text-center
					flex items-center justify-center
					px-12 py-4
					cursor-pointer"
						style={addTemplateButtonStyle}
						onClick={handleAddTemplate}
					>
						<AddIcon style={{ width: 12, height: 12 }} />
					</div>
				</Conditional>
			</div>
			<div className="h-full" style={containerStyle} id="stepsListContainer">
				<ul style={stepsListContainerStyle} className="margin-list-item">
					{stepList}
				</ul>
			</div>
			<CreateTemplatesModal isOpen={showCreateModal} onClose={handleTemplateModalSubmit} />
		</div>
	);
};

const addTemplateButtonStyle = {
	background: "#6370EC",
	borderRadius: 4,
	fontWeight: FONT_WEIGHT.BOLD,
	padding: "7px 16px",
	fontSize: 19,
	color: "#FFFFFF",
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
	marginTop: 18,
};

const stepsListContainerStyle = {
	position: POSITION.RELATIVE,
	marginTop: "-0.55rem",
	borderTopLeftRadius: "12px",
	overflow: OVERFLOW.AUTO,
};

export { ActionStepList };
