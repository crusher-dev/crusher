import React, { RefObject } from "react";
import { List } from "../../components/app/list";
import { ELEMENT_LEVEL_ACTIONS_LIST } from "../../../constants/elementLevelActions";
import { ELEMENT_LEVEL_ACTION } from "../../../interfaces/elementLevelAction";
import { performActionInFrame, turnOffInspectModeInFrame } from "../../../messageListener";
import { getActionsRecordingState, getInspectModeState } from "../../../redux/selectors/recorder";
import { useSelector } from "react-redux";
import { getStore } from "../../../redux/store";
import { recordAction } from "../../../redux/actions/actions";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { ACTIONS_RECORDING_STATE } from "../../../interfaces/actionsRecordingState";
import { updateActionsModalState, updateActionsRecordingState } from "../../../redux/actions/recorder";
import { ACTIONS_MODAL_STATE } from "../../../interfaces/actionsModalState";
import { recordActionWithHoverNodes } from "crusher-electron-app/src/extension/redux/utils/actions";
import { inspect } from "util";

interface iElementLevelActionListProps {
	deviceIframeRef: RefObject<HTMLWebViewElement>;
}

const ElementLevelActionsList = (props: iElementLevelActionListProps) => {
	const recordingState = useSelector(getActionsRecordingState);
	const inspecteModeState = useSelector(getInspectModeState);

	const items = ELEMENT_LEVEL_ACTIONS_LIST.map((action) => {
		return {
			id: action.id,
			icon: action.icon,
			title: action.title,
			desc: action.desc,
		};
	});

	const recordElementAction = (type: ActionsInTestEnum, meta: any = null, screenshot: string | null = null) => {
		recordActionWithHoverNodes({
			type: type,
			payload: {
				selectors: recordingState.elementInfo?.selectors,
				meta: meta,
			},
			screenshot: screenshot,
			//@TODO: Get the url of the target site here (Maybe some hack with atom or CEF)
			url: "",
		});
	};

	const handleActionSelected = (id: ELEMENT_LEVEL_ACTION) => {
		const store = getStore();

		switch (id) {
			case ELEMENT_LEVEL_ACTION.CLICK:
				recordElementAction(ActionsInTestEnum.CLICK, null, recordingState.elementInfo.screenshot);
				performActionInFrame(id, ACTIONS_RECORDING_STATE.ELEMENT, props.deviceIframeRef);
				break;
			case ELEMENT_LEVEL_ACTION.HOVER:
				recordElementAction(ActionsInTestEnum.HOVER, null, recordingState.elementInfo.screenshot);
				performActionInFrame(id, ACTIONS_RECORDING_STATE.ELEMENT, props.deviceIframeRef);
				break;
			case ELEMENT_LEVEL_ACTION.SCREENSHOT:
				recordElementAction(ActionsInTestEnum.ELEMENT_SCREENSHOT, null, recordingState.elementInfo.screenshot);
				break;
			case ELEMENT_LEVEL_ACTION.BLACKOUT:
				recordElementAction(ActionsInTestEnum.BLACKOUT, null, recordingState.elementInfo.screenshot);
				performActionInFrame(id, ACTIONS_RECORDING_STATE.ELEMENT, props.deviceIframeRef);
				break;
			case ELEMENT_LEVEL_ACTION.SHOW_ASSERT_MODAL:
				store.dispatch(updateActionsModalState(ACTIONS_MODAL_STATE.ASSERT_ELEMENT));
				return;
			case ELEMENT_LEVEL_ACTION.CUSTOM_SCRIPT:
				store.dispatch(updateActionsModalState(ACTIONS_MODAL_STATE.ELEMENT_CUSTOM_SCRIPT));
				return;
			default:
				console.debug("Unknown Element Level Action");
		}
		store.dispatch(updateActionsRecordingState(ACTIONS_RECORDING_STATE.PAGE));
		turnOffInspectModeInFrame(props.deviceIframeRef);
	};

	const handleBackAction = () => {
		const store = getStore();
		store.dispatch(updateActionsRecordingState(ACTIONS_RECORDING_STATE.PAGE));
		turnOffInspectModeInFrame(props.deviceIframeRef);
	};

	return (
		<List heading={"Select Element Action"} items={items} showBackButton={true} onBackPressed={handleBackAction} onItemClick={handleActionSelected}></List>
	);
};

export { ElementLevelActionsList };
