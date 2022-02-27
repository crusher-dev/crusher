import { Button, Input } from "@dyson/components/atoms";
import { Toggle } from "@dyson/components/atoms/toggle/toggle";
import { Conditional } from "@dyson/components/layouts";
import { css } from "@emotion/react";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { iAction } from "@shared/types/action";
import { turnOnElementMode } from "electron-app/src/lib/recorder/host-proxy";
import { updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { turnOnElementSelectorInspectMode, turnOnInspectMode } from "electron-app/src/ui/commands/perform";
import { CrossIcon, InspectElementIcon } from "electron-app/src/ui/icons";
import { selectors } from "playwright";
import React from "react";
import { useDispatch } from "react-redux";
import { SELECTOR_TYPE } from "unique-selector/src/constants";
import { sendSnackBarEvent } from "../../toast";
import { TTopLevelActionsEnum } from "../actionsPanel/pageActions";
import { RunAfterTestModal } from "../actionsPanel/pageActions/runAfterTestModal";
import { emitShowModal } from "../modalManager";
import { ActionSpecificInfo } from "./actionSpecificInfo";

function getSelectors(action: iAction) {
	if (!action.payload.selectors) return "";

	return action.payload.selectors
		.map((selector, index) => {
			return selector.value;
		})
		.join("\n");
}

// const ActionSpecificInfo = ({ action, actionIndex, setIsPinned, ...props }: { action: iAction; actionIndex: number }) => {
// 	const [stepSelectors, setStepSelectors] = React.useState(getSelectors(action));
// 	const dispatch = useDispatch();

// 	const handleUpdateInputText = (newText) => {
// 		dispatch(
// 			updateRecordedStep(
// 				{
// 					...action,
// 					payload: {
// 						...action.payload,
// 						meta: {
// 							...action.payload.meta,
// 							value: {
// 								...action.payload.meta.value,
// 								value: newText,
// 							},
// 						},
// 					},
// 				},
// 				actionIndex,
// 			),
// 		);
// 	};

// 	const handleUpdateNavigateUrl = (newURL) => {
// 		dispatch(
// 			updateRecordedStep(
// 				{
// 					...action,
// 					payload: {
// 						...action.payload,
// 						meta: {
// 							...action.payload.meta,
// 							value: newURL,
// 						},
// 					},
// 				},
// 				actionIndex,
// 			),
// 		);
// 	};

// 	const handleSelectElementForSelectors = () => {
// 		setIsPinned(true);
// 		turnOnElementSelectorInspectMode();
// 	};

// 	const handleSelectorsSave = (e) => {
// 		dispatch(
// 			updateRecordedStep(
// 				{
// 					...action,
// 					payload: {
// 						...action.payload,
// 						selectors: e.target.value.split("\n").map((a) => {
// 							return { type: SELECTOR_TYPE.PLAYWRIGHT, value: a.trim(), uniquenessScore: 1 };
// 						}),
// 					},
// 				},
// 				actionIndex,
// 			),
// 		);
// 	};

// 	React.useEffect(() => {
// 		const handleMessage = (event) => {
// 			try {
// 				const { type, selectedElementInfo } = JSON.parse(event.data);
// 				if (type === "selected-element-for-selectors") {
// 					setStepSelectors(
// 						selectedElementInfo.selectors
// 							.map((selector) => {
// 								return selector.value;
// 							})
// 							.join("\n"),
// 					);

// 					dispatch(
// 						updateRecordedStep(
// 							{
// 								...action,
// 								payload: {
// 									...action.payload,
// 									selectors: selectedElementInfo.selectors,
// 								},
// 							},
// 							actionIndex,
// 						),
// 					);
// 					sendSnackBarEvent({ type: "success", message: "Selectors updated" });
// 				}
// 			} catch (ex) {}
// 		};
// 		window.addEventListener("message", handleMessage);

// 		return () => {
// 			window.removeEventListener("message", handleMessage);
// 		};
// 	}, []);

// 	return (
// 		<>
// 			<Conditional showIf={action.type === ActionsInTestEnum.ADD_INPUT}>
// 				<div
// 					className={"flex mt-8 mb-16"}
// 					css={css`
// 						align-items: center;
// 					`}
// 				>
// 					<span>Input Text</span>
// 					<Input
// 						css={[
// 							inputStyle,
// 							css`
// 								min-width: 207rem;
// 							`,
// 						]}
// 						placeholder={"Enter frontend endpoint"}
// 						size={"medium"}
// 						initialValue={action.payload.meta?.value?.value}
// 						onReturn={handleUpdateInputText.bind(this)}
// 						onBlur={(e) => {
// 							handleUpdateInputText(e.target.value);
// 						}}
// 					/>
// 				</div>
// 			</Conditional>
// 			<Conditional showIf={action.type === ActionsInTestEnum.NAVIGATE_URL}>
// 				<div
// 					className={"flex mt-8 mb-16"}
// 					css={css`
// 						align-items: center;
// 					`}
// 				>
// 					<span>URL</span>
// 					<Input
// 						css={[
// 							inputStyle,
// 							css`
// 								min-width: 207rem;
// 							`,
// 						]}
// 						placeholder={"Enter frontend endpoint"}
// 						size={"medium"}
// 						initialValue={action.payload.meta?.value}
// 						onReturn={handleUpdateNavigateUrl.bind(this)}
// 						onBlur={(e) => {
// 							handleUpdateNavigateUrl(e.target.value);
// 						}}
// 					/>
// 				</div>
// 			</Conditional>
// 			<Conditional showIf={action.type.startsWith("ELEMENT")}>
// 				<div className={"mt-8"}>
// 					<span>Selectors</span>
// 					<div
// 						css={css`
// 							flex: 1;
// 							margin-top: 8rem;
// 							position: relative;
// 						`}
// 					>
// 						<textarea
// 							css={css`
// 								font-size: 12rem;
// 							`}
// 							placeholder={"Selector come here"}
// 							onChange={(e) => setStepSelectors(e.target.value)}
// 							onKeyDown={(e) => {
// 								if (e.keyCode === 13) {
// 									handleSelectorsSave(e);
// 								}
// 							}}
// 							css={[textAreaStyle, scrollBarStyle]}
// 							value={stepSelectors}
// 						/>
// 						<InspectElementIcon
// 							onClick={handleSelectElementForSelectors}
// 							css={css`
// 								width: 16rem;
// 								height: 16rem;
// 								position: absolute;
// 								right: 7rem;
// 								bottom: 9rem;
// 								:hover {
// 									opacity: 0.8;
// 								}
// 							`}
// 						/>
// 					</div>
// 				</div>
// 			</Conditional>
// 			<Conditional showIf={[ActionsInTestEnum.WAIT, ActionsInTestEnum.RUN_AFTER_TEST].includes(action.type)}>
// 				<div className={"mt-8"}>
// 					<span>Edit mode</span>
// 					<div
// 						css={css`
// 							flex: 1;
// 							margin-top: 24rem;
// 							position: relative;
// 							display: flex;
// 							justify-content: center;
// 						`}
// 					>
// 						<Button
// 							onClick={() => {
// 								setIsPinned(true);

// 								emitShowModal({
// 									type: action.type === ActionsInTestEnum.WAIT ? TTopLevelActionsEnum.WAIT : TTopLevelActionsEnum.RUN_AFTER_TEST,
// 									stepIndex: actionIndex,
// 								});
// 							}}
// 						>
// 							<span
// 								css={css`
// 									font-size: 12.25rem;
// 									padding: 0 14rem;
// 								`}
// 							>
// 								Open Edit Modal
// 							</span>
// 						</Button>
// 					</div>
// 				</div>
// 			</Conditional>
// 		</>
// 	);
// };

const StepInfoEditor = ({ action, isPinned, setIsPinned, actionIndex, ...props }: { action: iAction; actionIndex: number }) => {
	const [isOptional, setIsOptional] = React.useState(!!action.payload.isOptional);
	const [isStepNameEditable, setIsStepNameEditable] = React.useState(false);
	const [stepName, setStepName] = React.useState(action.name ? action.name : "Enter step name");
	const stepNameRef: React.Ref<HTMLInputElement> = React.useRef(null);

	const dispatch = useDispatch();

	const updateStepName = () => {
		setIsStepNameEditable(false);
		dispatch(
			updateRecordedStep(
				{
					...action,
					name: stepNameRef.current.value,
				},
				actionIndex,
			),
		);
	};

	const handleOptionalToggle = (state) => {
		setIsOptional.bind(this, state);

		dispatch(
			updateRecordedStep(
				{
					...action,
					payload: {
						...action.payload,
						isOptional: state,
					},
				},
				actionIndex,
			),
		);
	};

	const handleNameDoubleClick = () => {
		setIsStepNameEditable(true);
		setTimeout(() => {
			stepNameRef.current.focus();
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.keyCode === 13) {
			updateStepName();
		}
	};

	return (
		<div
			className={"step-info-editor"}
			onClick={setIsPinned!.bind(this, true)}
			css={[containerStyle, scrollBarStyle, isPinned ? pinnedContainerStyle : null]}
		>
			<div className={"font-600 text-15 flex p-12 pt-8 pb-8 pl-8 mt-6"}>
				<div onDoubleClick={handleNameDoubleClick.bind(this)}>
					<input
						ref={stepNameRef}
						css={[stepNameStyle, isStepNameEditable ? editableStepNameStyle : null]}
						value={stepName}
						onBlur={updateStepName}
						onChange={(e) => setStepName(e.target.value)}
						onKeyDown={handleKeyDown.bind(this)}
						disabled={!isStepNameEditable}
					/>
				</div>
				<CrossIcon
					onClick={(e: React.MouseEvent<HTMLOrSVGElement>) => {
						e.stopPropagation();
						setIsPinned!(false);
					}}
					css={crossIconStyle}
				/>
			</div>

			<div css={actionInfoContainerStyle} className={"p-12"}>
				<ActionSpecificInfo setIsPinned={setIsPinned!.bind(this)} action={action} actionIndex={actionIndex} />
			</div>
		</div>
	);
};
const containerStyle = css`
	min-width: 325rem;
	padding-bottom: 8rem;
	position: fixed;
	border-radius: 8rem;
	background: #111213;
	border: 1px solid #272727;
	transform: translateX(calc(-100% - 1rem));
	font-family: Cera Pro;
	bottom: 0%;
	min-height: 274rem;
	max-height: 274rem;
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
`;
const pinnedContainerStyle = css`
	z-index: 100;
`;

const stepNameStyle = css`
	font-size: 13.75rem;
	padding: 4rem 4rem;
	border: none;
	background: transparent;
	font-weight: 400;
	border: 1px solid transparent;
	:hover {
		opacity: 0.9;
	}
`;
const editableStepNameStyle = css`
	border: 1px solid rgba(196, 196, 196, 0.2);
`;

const crossIconStyle = css`
	width: 10rem;
	margin-left: auto;
	margin-top: 4rem;
`;

const actionInfoContainerStyle = css`
	font-family: Gilroy;
	font-size: 12.8rem;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const scrollBarStyle = css`
	::-webkit-scrollbar {
		display: none;
	}
`;

export { StepInfoEditor };
