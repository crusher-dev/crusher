import { EditPencilIcon } from "electron-app/src/_ui/constants/icons";
import React, { useEffect } from "react";
import { css } from "@emotion/react";
import { getAllSteps, getSavedSteps, getStepInfo } from "electron-app/src/store/selectors/recorder";
import { useSelector, useDispatch } from "react-redux";
import { TextHighlighter, TextHighlighterText, transformStringSelectorsToArray } from "../helper";
import { deleteRecordedSteps, updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { FieldSelectorPicker } from "electron-app/src/_ui/ui/containers/components/sidebar/stepEditor/fields";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { emitShowModal } from "electron-app/src/_ui/ui/containers/components/modals";
import { Button } from "@dyson/components/atoms";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { sendSnackBarEvent } from "electron-app/src/_ui/ui/containers/components/toast";
import { EditableInput } from "electron-app/src/_ui/ui/components/inputs/editableInput";
import { useAtom } from "jotai";
import { editInputAtom, isStepHoverAtom } from "electron-app/src/_ui/store/jotai/testsPage";
import { SelectorEditorCard } from "./selectorEditor";
import { addHttpToURLIfNotThere } from "electron-app/src/utils";
import _ from "lodash";
import { isTemplateFormat } from "@shared/utils/templateString";
import { StepEditorCustomCode } from "electron-app/src/_ui/ui/containers/components/modals/page/stepEditorModal";

const limitString = (string, offset = null) => {
	if (!string) return string;
	const maxOffset = offset || 25;
	if (string.length > maxOffset) {
		return string.substring(0, maxOffset) + "...";
	}
	return string;
};

const SelectorInfo = ({ stepId, setShowAdvanced }) => {
	const stepInfo = useSelector(getStepInfo(stepId));
	const selectors = stepInfo.step?.payload?.selectors;

	const description = React.useMemo(() => {
		if (!selectors) return null;
		const sortedSelectorsByLength = selectors;

		const offset = 10;
		if (sortedSelectorsByLength.length === 1) {
			return `and ${limitString(sortedSelectorsByLength[0].value, offset)}`;
		} else if (selectors.length === 2) {
			return `${limitString(sortedSelectorsByLength[0].value, offset)} and ${limitString(sortedSelectorsByLength[1].value, offset)}`;
		} else {
			return `${limitString(sortedSelectorsByLength[0].value, offset)}, ${limitString(sortedSelectorsByLength[1].value, offset)} and ${sortedSelectorsByLength.length - 2
				} more`;
		}
	}, [selectors]);
	return (
		<div css={selectorInfoContainerCss}>
			<StepEditorCustomCode/>
			<div className={"flex items-center"}>
				<div>
					<span>main selector:</span>
					<span onDoubleClick={setShowAdvanced.bind(this, true)} css={mainSelectorCss} className={"font-medium"}>
						{limitString(stepInfo.description)}
					</span>
				</div>

				<EditPencilIcon onClick={setShowAdvanced.bind(this, true)} className={"ml-10"} css={pencilIconCss} />
				<FieldSelectorPicker stepId={stepId} className={"ml-10"} />
			</div>
			<div css={selectorExtraCss} className={"mt-7"}>
				{description}
			</div>
		</div>
	);
};

const selectorExtraCss = css`
	font-size: 12rem;
`;
const mainSelectorCss = css`
	color: rgba(255, 255, 255, 0.89);
`;
const selectorInfoContainerCss = css`
	font-size: 13rem;

	color: rgba(255, 255, 255, 0.54);
`;

const pencilIconCss = css`
	width: 10.5rem;
	height: 10.5rem;
	margin-top: -2rem;
	:hover {
		opacity: 0.8;
	}
`;

const InputValueEditor = ({ step, stepId }) => {
	const [, setIsEditMode] = React.useState(false);
	const dispatch = useDispatch();
	const [isStepNameEditing, setIsStepNameEditing] = useAtom(editInputAtom);

	const getInfo = (step) => {
		if (step.type === ActionsInTestEnum.ADD_INPUT) {
			const updateInputValue = (value: string) => {
				if (step.payload.meta.value.value !== value) {
					step.payload.meta.value.value = value;
					dispatch(updateRecordedStep(step, stepId));
					sendSnackBarEvent({ type: "success", message: "Value updated" });
					return { value: finalValue };
				}
			};

			const inputValue = step.payload.meta?.value?.value || "";
			return { label: "Value:", value: inputValue, placeholder: "Enter value", updateCallback: updateInputValue };
		}
		if ([ActionsInTestEnum.NAVIGATE_URL, ActionsInTestEnum.WAIT_FOR_NAVIGATION].includes(step.type)) {
			const updateNavigationUrlValue = (value: string) => {
				const finalValue = step.type === ActionsInTestEnum.NAVIGATE_URL ? isTemplateFormat(value) ? value : addHttpToURLIfNotThere(value) : value;
				if (step.payload.meta.value !== finalValue) {
					step.payload.meta.value = finalValue;
					dispatch(updateRecordedStep(step, stepId));
					sendSnackBarEvent({ type: "success", message: "Navigation value updated" });
					return { value: finalValue };
				}
			};

			const navigationUrlValue = step.payload.meta?.value || "";
			return { label: "URL:", value: navigationUrlValue, placeholder: "Enter url", updateCallback: updateNavigationUrlValue };
		}

		return null;
	};

	const handleEdit = () => {
		setIsStepNameEditing(`nav-` + stepId + "-url");

	}
	const fieldInfo = getInfo(step);
	const handleUpdate = (value) => {
		setIsEditMode(false);
		return fieldInfo.updateCallback(value);
	};
	if (!fieldInfo) return null;


	return (
		<div className={"flex items-center mt-20"}>
			<div
				css={[
					labelCss
				]}
				className={"mr-7" + (isStepNameEditing === stepId + "-nav-url" ? "mt-2" : "")}
			>
				{fieldInfo.label}
			</div>
			<EditableInput
				inputCss={css`
					input {
						width: 180rem;
						min-width: 180rem !important;
						font-family: "Gilroy" !important;
						font-style: normal !important;
						font-weight: 400 !important;
						font-size: 13rem !important;
						height: 24rem !important;

						background: rgba(177, 79, 254, 0.04) !important;
						border: 0.5px solid #b14ffe !important;
						border-radius: 8rem !important;

						color: rgba(215, 223, 225, 0.93) !important;
					}
				`}

				labelCss={css`
					font-family: "Gilroy" !important;
					font-style: normal !important;
					font-weight: 400 !important;
					font-size: 13rem !important;
					border: 0.5px solid transparent !important;
					padding: 4rem 0rem !important;
				`}
				defaultValue={fieldInfo.value}
				id={`nav-${stepId}-url`}
				onChange={handleUpdate.bind(this)}
			/>
			<EditPencilIcon onClick={handleEdit} className={"ml-10"} css={editUrlIconCss} />
		</div>
	);
};

const StepName = ({ stepId }) => {
	const [isStepNameEditing, setIsStepNameEditing] = useAtom(editInputAtom);

	const stepInfo = useSelector(getStepInfo(stepId));
	const steps = useSelector(getAllSteps);
	const step = steps[stepId];
	const dispatch = useDispatch();
	const [title, setTitle] = React.useState(stepInfo.name);

	const updateStepName = (stepName) => {
		dispatch(
			updateRecordedStep(
				{
					...step,
					name: stepName,
				},
				stepId,
			),
		);
	};

	const handleOnChange = (value) => {
		// console.log("INptu is", e.target.value);
		setTitle(value);
		updateStepName(value);
	};

	const LabelComponent = () => {
		return <>{TextHighlighter({ text: title }, true)}</>;
	};

	const showStepDescriptionHelper = isStepNameEditing === `${stepId}-stepName` || stepInfo.hasCustomName;

	return (
		<>
			<div css={stepNameCss} className={"flex items-center"}>
				<div css={css``}>
					<EditableInput
						inputCss={css`
						input {
							width: 180rem;
							min-width: 180rem !important;
							font-size: 14rem !important;
							/* or 93% */
							border: 0.5px solid #b14ffe !important;
							border-radius: 8rem !important;
							padding: 0rem 8rem !important;
							color: rgba(215, 223, 225, 0.6) !important;
							margin-left: 0rem !important;
							height: 26rem !important;
						}
					`}
						labelCss={css`
						font-size: 14rem !important;
						border: 0.5px solid transparent !important;
						padding: 4rem 0rem !important;
					`}
						labelComponent={<LabelComponent />}
						defaultValue={TextHighlighterText({ text: title }).join(" ")}
						id={stepId + "-stepName"}
						onChange={handleOnChange.bind(this)}
					/>
				</div>
				<EditPencilIcon onClick={setIsStepNameEditing.bind(this, stepId + "-stepName")} className={"ml-10"} css={pencilIconCss} />

			</div>
			{showStepDescriptionHelper ? (
				<div
					css={css`
						font-size: 12rem;
						margin-top: 8rem;
					`}
					className="ml-2"
				>
					{TextHighlighter({ text: stepInfo.actionDescription }, true)}
				</div>
			) : ""}

		</>
	);
};

const StepMetaInfo = ({ stepId, setShowAdvanced }) => {
	const steps = useSelector(getAllSteps);

	const hasSelectors = steps[stepId].type.startsWith("ELEMENT");
	const showFieldInput = [ActionsInTestEnum.NAVIGATE_URL, ActionsInTestEnum.WAIT_FOR_NAVIGATION, ActionsInTestEnum.ADD_INPUT].includes(steps[stepId].type);

	return (
		<div css={stepMetaInfoContainerCss} className={"px-20 py-12"}>
			<StepName stepId={stepId} />


			{showFieldInput ? <InputValueEditor stepId={stepId} step={steps[stepId]} /> : ""}

			{hasSelectors ? (
				<div className={"flex mt-35"}>
					<SelectorInfo setShowAdvanced={setShowAdvanced} stepId={stepId} />
					{/* <div css={uniqueCss} className={"ml-auto"}>
                       <span css={css`color: rgba(148, 111, 255, 0.99);`}>90%</span> unique
                   </div> */}
				</div>
			) : (
				""
			)}

			{/* <div css={metaInfoFooterCss} className={`flex ${hasSelectors || showFieldInput ? "mt-52" : "mt-30"}`}> */}
			{/* <div>took 1.9 sec</div> */}
			{/* <div className={"ml-auto"}>view logs</div> */}
			{/* </div> */}
		</div>
	);
};

const editUrlIconCss = css`
	width: 11rem;
	height: 11rem;
	margin-top: -2rem;
	:hover {
		opacity: 0.8;
	}
`;

const labelCss = css`
	font-size: 13rem;
	color: rgba(215, 223, 225, 0.6);
`;

const stepNameCss = css`
	font-weight: 500;
	font-size: 15rem;
`;
const stepMetaInfoContainerCss = css`
	background: #070707;
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

// Actions map with modal types
export const EDIT_MODE_MAP = {
	[ActionsInTestEnum.WAIT]: "WAIT",
	[ActionsInTestEnum.VALIDATE_SEO]: "SHOW_SEO_MODAL",
	[ActionsInTestEnum.CUSTOM_CODE]: "CUSTOM_CODE",
	[ActionsInTestEnum.RUN_AFTER_TEST]: "RUN_AFTER_TEST",
	[ActionsInTestEnum.ASSERT_ELEMENT]: "SHOW_ASSERT_MODAL",
	[ActionsInTestEnum.CUSTOM_ELEMENT_SCRIPT]: "SHOW_CUSTOM_SCRIPT_MODAL",
};

const StepOverlayEditor = ({ stepId }) => {
	const [showAdvanced, setShowAdvanced] = React.useState({ show: false, containerHeight: null });
	const containerRef = React.useRef(null);
	const [, setStepHovered] = useAtom(isStepHoverAtom)

	const steps = useSelector(getAllSteps);
	const dispatch = useDispatch();
	const showPreview = ![ActionsInTestEnum.SET_DEVICE, ActionsInTestEnum.RUN_AFTER_TEST].includes(steps[stepId].type);

	const step = steps[stepId];
	const shouldShowEditButton = Object.keys(EDIT_MODE_MAP).includes(step.type);

	const handleDelete = () => {
		dispatch(deleteRecordedSteps([stepId]));
	};
	const handleEditModeClick = () => {
		emitShowModal({
			type: EDIT_MODE_MAP[step.type],
			stepIndex: stepId,
		});
	};

	const handleShowAdvanced = (shouldShow) => {
		if (shouldShow) setShowAdvanced({ show: true, containerHeight: containerRef.current.clientHeight });
		else setShowAdvanced({ show: false, containerHeight: null });
	};

	useEffect(() => {
		setStepHovered(true)
		return () => {
			setStepHovered(false)
		}
	}, [])

	const editMessage = React.useMemo(() => {
		if ([ActionsInTestEnum.VALIDATE_SEO, ActionsInTestEnum.ASSERT_ELEMENT].includes(step.type)) {
			return "see checks";
		}
		if (step.type === ActionsInTestEnum.CUSTOM_CODE) {
			return "code editor";
		}
		if (step.type === ActionsInTestEnum.WAIT) {
			return "set wait time";
		}

		return "edit";
	});

	const handleGoBack = () => {
		setShowAdvanced({ show: false, containerHeight: null });
	};
	return (
		<div
			onContextMenu={(e) => e.preventDefault()}
			css={containerCss}
			style={{ height: "100vh" }}
			ref={containerRef}
		>
			{showAdvanced.show ? (
				<>
					<SelectorEditorCard goBack={handleGoBack} stepId={stepId} />
				</>
			) : (
				<>
					<StepMetaInfo setShowAdvanced={handleShowAdvanced} stepId={stepId} />
					<div className={"px-20 py-24"}>
						{false && showPreview ? (
							<div className="flex">
								<div css={elementImageCss}></div>
								<div className={"ml-auto"}>
									<ul css={actionsListCss}>
										<li>modify url</li>
									</ul>
								</div>
							</div>
						) : (
							""
						)}

						{shouldShowEditButton ? (
							<Button onClick={handleEditModeClick.bind(this)} bgColor="tertiary-outline" css={buttonCss}>
								{editMessage}
							</Button>
						) : (
							""
						)}
						<div className={"mt-28 flex justify-end"}>
							<div onClick={handleDelete} css={deleteCss}>
								delete
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};
const buttonCss = css`
	background: #b341f9 !important;
	border-color: #b341f9 !important;
	font-size: 14rem;
	box-sizing: border-box;
	border-radius: 8rem !important;
	height: 36rem;
	width: 114rem;
	position: relative;
	left: 50%;
	transform: translateX(-50%);
`;
const deleteCss = css`
	font-size: 12rem;
	color: #db6e82;
	:hover {
		opacity: 0.8;
	}
`;
const actionsListCss = css`
	font-family: "Gilroy";

	font-weight: 400;
	font-size: 12rem;

	color: rgba(255, 255, 255, 0.53);

	li {
		:hover {
			text-decoration: underline;
			opacity: 0.8;
		}
	}
`;
const elementImageCss = css`
	width: 255rem;
	height: 172rem;
	background: rgba(128, 128, 128, 0.8);
	border-radius: 17rem;
`;

const containerCss = css`
	width: 412rem;
`;

export { StepOverlayEditor as StepEditor };
