import React, { ReactText } from "react";
import { iAction } from "@shared/types/action";
import { css } from "@emotion/react";
import { FieldInput, FieldSelectorPicker, FieldToggle } from "./fields";
import { useDispatch } from "react-redux";
import { updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { Conditional } from "@dyson/components/layouts";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { sendSnackBarEvent } from "../../toast";
import { SELECTOR_TYPE } from "unique-selector/src/constants";

interface IActionSpecificInfoProps {
	action: iAction;
	actionIndex: number;
	setIsPinned: any;
}

const ActionSpecificInfo = (props: IActionSpecificInfoProps) => {
	const { action, actionIndex } = props;
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
		dispatch(updateRecordedStep({ ...action }, actionIndex));
		if (shouldNotify) {
			sendSnackBarEvent({ type: "success", message: "Selectors updated" });
		}
	};
	const saveSelectorsOnUserInput = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.keyCode === 13) {
			handleOnSelectorsPicked(transformStringSelectorsToArray((e.target as any).value), false);
		}
	};

	return (
		<div css={containerStyle}>
			<Conditional showIf={isElementStep}>
				<FieldSelectorPicker
					onChange={saveSelectorsOnUserInput.bind(this)}
					onSelectorsPicked={handleOnSelectorsPicked.bind(this)}
					className={"mt-8"}
					label={"Selectors"}
					value={readableSelectors}
				/>
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
				<FieldToggle className={"mt-12"} label={"Mark as optional"} isOn={!!isOptional} callback={handleOptionalToggle} />
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

export { ActionSpecificInfo };
