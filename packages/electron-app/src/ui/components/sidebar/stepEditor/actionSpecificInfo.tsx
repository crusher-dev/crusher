import React, { ReactText } from "react";
import { iAction } from "@shared/types/action";
import { css } from "@emotion/react";
import { FieldEditModeButton, FieldInput, FieldSelectorPicker, FieldToggle } from "./fields";
import { useDispatch } from "react-redux";
import { updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { Conditional } from "@dyson/components/layouts";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { sendSnackBarEvent } from "../../toast";
import { SELECTOR_TYPE } from "unique-selector/src/constants";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { emitShowModal } from "../../modals";
import { TTopLevelActionsEnum } from "../actionsPanel/pageActions";
import { TElementActionsEnum } from "../actionsPanel/elementActions";
interface IActionSpecificInfoProps {
	action: iAction;
	actionIndex: number;
	setIsPinned: any;
}

// Actions map with modal types
const EDIT_MODE_MAP = {
	[ActionsInTestEnum.WAIT]: TTopLevelActionsEnum.WAIT,
	[ActionsInTestEnum.VALIDATE_SEO]: TTopLevelActionsEnum.SHOW_SEO_MODAL,
	[ActionsInTestEnum.CUSTOM_CODE]: TTopLevelActionsEnum.CUSTOM_CODE,
	[ActionsInTestEnum.RUN_AFTER_TEST]: TTopLevelActionsEnum.RUN_AFTER_TEST,
	[ActionsInTestEnum.ASSERT_ELEMENT]: TElementActionsEnum.SHOW_ASSERT_MODAL,
	[ActionsInTestEnum.CUSTOM_ELEMENT_SCRIPT]: TElementActionsEnum.SHOW_CUSTOM_SCRIPT_MODAL,
};

const ActionSpecificInfo = (props: IActionSpecificInfoProps) => {
	const { action, actionIndex } = props;
	const textAreaRef: React.Ref<HTMLTextAreaElement> = React.useRef(null);
	const dispatch = useDispatch();

	const isElementStep = action.type.startsWith("ELEMENT");

	// <--- Optional --->
	const isOptional = action.payload.isOptional;
	const handleOptionalToggle = (state) => {
		action.payload.isOptional = state;
		dispatch(updateRecordedStep({ ...action }, actionIndex));
	};

	// <-- Timeout -->
	const timeout = action.payload.timeout || "30000";
	const updateTimeout = (value: string) => {
		action.payload.timeout = parseInt(value, 10);
		dispatch(updateRecordedStep({ ...action }, actionIndex));
	};
	const handleTimeoutBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		updateTimeout((e.target as HTMLInputElement).value);
	};

	// <--- Selctor Picker --->
	const readableSelectors = getReadbleSelectors(action.payload.selectors!);
	const handleOnSelectorsPicked = (selectors: Array<iSelectorInfo>, shouldNotify = true) => {
		action.payload.selectors = selectors;
		const readableSelectors = getReadbleSelectors(action.payload.selectors!);
		console.log("Text area is", textAreaRef.current, readableSelectors);
		textAreaRef.current.value = readableSelectors;
		dispatch(updateRecordedStep({ ...action }, actionIndex));
		if (shouldNotify) {
			sendSnackBarEvent({ type: "success", message: "Selectors updated" });
		}
	};
	const saveSelectorsOnUserInput = (e) => {
		handleOnSelectorsPicked(transformStringSelectorsToArray(e.target.value), false);
	};

	// <--- Edit mode (For opening advanced modals) --->
	const handleEditModeClick = () => {
		if (!EDIT_MODE_MAP[action.type]) {
			return sendSnackBarEvent({
				type: "error",
				message: "This action doesn't have edit mode",
			});
		}

		emitShowModal({
			type: EDIT_MODE_MAP[action.type],
			stepIndex: actionIndex,
		});
	};

	// <-- Input -->
	const inputValue = action.payload.meta?.value?.value || "";
	const updateInputActionValue = (value: string) => {
		if (action.payload.meta.value.value !== value) {
			action.payload.meta.value.value = value;
			dispatch(updateRecordedStep({ ...action }, actionIndex));
			sendSnackBarEvent({ type: "success", message: "Value updated" });
		}
	};
	const handleInputActionBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		updateInputActionValue((e.target as HTMLInputElement).value);
	};

	// <-- Both Navigate Url and Wait for navigation -->
	const navigationUrlValue = action.payload.meta?.value || "";
	const updateNavigationUrlValue = (value: string) => {
		if (action.payload.meta.value !== value) {
			action.payload.meta.value = value;
			dispatch(updateRecordedStep({ ...action }, actionIndex));
			sendSnackBarEvent({ type: "success", message: "Navigation value updated" });
		}
	};
	const handleNavigationInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		updateNavigationUrlValue((e.target as HTMLInputElement).value);
	};

	return (
		<div css={containerStyle}>
			<div className="mt-4">
				<Conditional showIf={action.type === ActionsInTestEnum.ADD_INPUT}>
					<FieldInput
						label={"Input value"}
						placeholder={"Enter input value"}
						size={"small"}
						initialValue={inputValue}
						onBlur={handleInputActionBlur}
						onReturn={updateInputActionValue}
						inputStyleCSS={bigInputStyle}
					/>
				</Conditional>
				<Conditional showIf={[ActionsInTestEnum.NAVIGATE_URL, ActionsInTestEnum.WAIT_FOR_NAVIGATION].includes(action.type)}>
					<FieldInput
						label={"URL"}
						placeholder={"Enter url"}
						size={"small"}
						initialValue={navigationUrlValue}
						onBlur={handleNavigationInputBlur}
						onReturn={updateNavigationUrlValue}
						inputStyleCSS={bigInputStyle}
					/>
				</Conditional>
				<Conditional showIf={isElementStep}>
					<FieldSelectorPicker
						ref={textAreaRef}
						onChange={saveSelectorsOnUserInput.bind(this)}
						onSelectorsPicked={handleOnSelectorsPicked.bind(this)}
						className={
							[ActionsInTestEnum.ADD_INPUT, ActionsInTestEnum.NAVIGATE_URL, ActionsInTestEnum.WAIT_FOR_NAVIGATION].includes(action.type)
								? "mt-8"
								: ""
						}
						label={"Selectors"}
						initialValue={readableSelectors}
					/>
				</Conditional>
			</div>
			<Conditional showIf={Object.keys(EDIT_MODE_MAP).includes(action.type)}>
				<FieldEditModeButton size={"small"} label={"Edit mode"} className={"mt-8"} onClick={handleEditModeClick.bind(this)} />
			</Conditional>
			<div css={commonFieldsContainer}>
				<FieldInput
					className={"mt-28"}
					label={"Timeout(s)"}
					placeholder={"Enter timeout in (ms)"}
					size={"small"}
					initialValue={timeout.toString()}
					onBlur={handleTimeoutBlur}
					onReturn={updateTimeout}
				/>
				<FieldToggle className={"mt-12"} label={"Mark as optional"} checked={!!isOptional} onCheckedChange={handleOptionalToggle} />
			</div>
		</div>
	);
};

function getReadbleSelectors(selectors: Array<iSelectorInfo> | null) {
	if (!selectors) return "";

	return selectors
		.map((selector, index) => {
			return selector.value;
		})
		.join("\n");
}

function transformStringSelectorsToArray(selectors: string) {
	const selectorsArray = selectors.split("\n");
	return selectorsArray.map((selector) => {
		return { type: SELECTOR_TYPE.PLAYWRIGHT, value: selector.trim(), uniquenessScore: 1 };
	});
}

const containerStyle = css`
	height: 100%;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const commonFieldsContainer = css`
	margin-top: auto;
`;

const bigInputStyle = css`
	max-width: 200rem;
	input {
		padding: 14rem 6rem;
	}
`;
export { ActionSpecificInfo };
