import React, { useEffect } from "react";
import { css } from "@emotion/react";
import { getAllSteps, getSavedSteps, getStepInfo } from "electron-app/src/store/selectors/recorder";
import { useSelector, useDispatch } from "react-redux";
import { TextHighlighter, TextHighlighterText, transformStringSelectorsToArray } from "../helper";
import { deleteRecordedSteps, updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { emitShowModal } from "electron-app/src/_ui/ui/containers/components/modals";
import { Button } from "@dyson/components/atoms";

import { EditableInput } from "electron-app/src/_ui/ui/components/inputs/editableInput";
import { useAtom } from "jotai";
import { editInputAtom, isStepHoverAtom } from "electron-app/src/_ui/store/jotai/testsPage";
import _ from "lodash";

import { StepEditorCustomCode } from "electron-app/src/_ui/ui/containers/components/modals/page/stepEditorModal";

import { PlayIconV3 } from "electron-app/src/_ui/constants/old_icons";

const limitString = (string, offset = null) => {
	if (!string) return string;
	const maxOffset = offset || 25;
	if (string.length > maxOffset) {
		return string.substring(0, maxOffset) + "...";
	}
	return string;
};

const SelectorBox = ({ stepId }) => {
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

	return(
		<Accordion 
		topBar={(
			<React.Fragment>
				<div className={"flex items-center px-12 pt-12"} >
				<div>
					<span>main selector:</span>
					<span css={mainSelectorCss} className={"font-medium"}>
						{limitString(stepInfo.description)}
					</span>
				</div>
				<PlayIconV3 css={playIconCss}/>
			</div>
			<div css={selectorExtraCss} className={"mt-7 px-12 pb-12"}>
				{description}
			</div>
			</React.Fragment>
		)} children={
			<div className="">
				<StepEditorCustomCode stepId={stepId}/>
			</div>
		}/>

	)

};

const playIconCss = css`
	width: 6rem;
	height: 8rem;
	margin-left: auto;
	margin-right: 5rem;
	margin-top: 3rem;
	path {
		fill: #797979;
	}
	:hover {
		opacity: 0.8;
	}
`;

export const Accordion = ({children,topBar})=>{
	const [hover,setHover] = React.useState(false);

	return (
		<div className="w-full">
			<div css={[wrapboxCSS]} onClick={setHover.bind(this,!hover)}>
				{topBar}
			</div>
			{hover &&
			<div css={childContainer}>
				{children}
			</div>
			}
		</div>
	)
}

const childContainer = css`
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	padding: 0px;
	width: 100%;
`

const wrapboxCSS = css`
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	border-top: 1px solid rgba(255, 255, 255, 0.08);
	padding: 0px;
	width: 100%;
	:hover{
		background: rgba(255, 255, 255, 0.02);
	}
`

const selectorExtraCss = css`
	font-size: 12rem;
`;
const mainSelectorCss = css`
	color: rgba(255, 255, 255, 0.89);
`;

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
		setTitle(value);
		updateStepName(value);
	};

	const LabelComponent = () => {
		return <>{TextHighlighter({ text: title }, true)}</>;
	};

	const showStepDescriptionHelper = isStepNameEditing === `${stepId}-stepName` || stepInfo.hasCustomName;

	return (
		<>
			<div className={"flex items-center px-12 text-15 font-500"}>
	
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
			{showStepDescriptionHelper ? (
				<div className="ml-2 mt-8 text-12 px-12 tracking-wide">
					{TextHighlighter({ text: stepInfo.actionDescription }, true)}
				</div>
			) : ""}

		</>
	);
};

const StepMetaInfo = ({ stepId }) => {
	const steps = useSelector(getAllSteps);

	const hasSelectors = steps[stepId].type.startsWith("ELEMENT");

	return (
		<div css={stepMetaInfoContainerCss} className={"py-12"}>
			<StepName stepId={stepId} />

			{hasSelectors ? (
				<div className={"flex mt-35"}>
					<SelectorBox  stepId={stepId} />
				</div>
			) : (
				""
			)}

		</div>
	);
};


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

const StepSidebarBox = ({ stepId }) => {
	
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


	return (
		<div
			onContextMenu={(e) => e.preventDefault()}
			css={containerCss}
			style={{ height: "100vh" }}
			ref={containerRef}
		>

					<StepMetaInfo stepId={stepId} />
					<div className={"py-24"}>
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
						<div className={"mt-28 flex justify-end px-12"}>
							<div onClick={handleDelete} css={deleteCss}>
								delete
							</div>
						</div>
					</div>
	
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

export { StepSidebarBox as StepEditor };
