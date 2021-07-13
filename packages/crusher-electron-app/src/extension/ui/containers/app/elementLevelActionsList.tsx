import React, { RefObject } from "react";
import { List } from "../../components/app/list";
import { ELEMENT_LEVEL_ACTIONS_LIST } from "../../../constants/elementLevelActions";
import { ELEMENT_LEVEL_ACTION } from "../../../interfaces/elementLevelAction";
import { performActionInFrame, turnOffInspectModeInFrame } from "../../../messageListener";
import { getActionsRecordingState } from "../../../redux/selectors/recorder";
import { useSelector } from "react-redux";
import { getStore } from "../../../redux/store";
import { recordAction } from "../../../redux/actions/actions";
import { ACTIONS_IN_TEST } from "@shared/constants/recordedActions";
import { ACTIONS_RECORDING_STATE } from "../../../interfaces/actionsRecordingState";
import { updateActionsModalState, updateActionsRecordingState } from "../../../redux/actions/recorder";
import { ACTIONS_MODAL_STATE } from "../../../interfaces/actionsModalState";

interface iElementLevelActionListProps {
	deviceIframeRef: RefObject<HTMLWebViewElement>;
}

const ElementLevelActionsList = (props: iElementLevelActionListProps) => {
	const recordingState = useSelector(getActionsRecordingState);
	const items = ELEMENT_LEVEL_ACTIONS_LIST.map((action) => {
		return {
			id: action.id,
			icon: action.icon,
			title: action.title,
			desc: action.desc,
		};
	});

	const recordElementAction = (type: ACTIONS_IN_TEST, meta: any = null) => {
		const store = getStore();

		store.dispatch(
			recordAction({
				type: type,
				payload: {
					selectors: recordingState.elementInfo?.selectors,
					meta: meta,
				},
				//@TODO: Get the url of the target site here (Maybe some hack with atom or CEF)
				url: "",
			}),
		);
	};

	const handleActionSelected = (id: ELEMENT_LEVEL_ACTION) => {
		const store = getStore();

		switch (id) {
			case ELEMENT_LEVEL_ACTION.CLICK:
				recordElementAction(ACTIONS_IN_TEST.CLICK);
				performActionInFrame(id, ACTIONS_RECORDING_STATE.ELEMENT, props.deviceIframeRef);
				break;
			case ELEMENT_LEVEL_ACTION.HOVER:
				recordElementAction(ACTIONS_IN_TEST.HOVER);
				performActionInFrame(id, ACTIONS_RECORDING_STATE.ELEMENT, props.deviceIframeRef);
				break;
			case ELEMENT_LEVEL_ACTION.SCREENSHOT:
				recordElementAction(ACTIONS_IN_TEST.ELEMENT_SCREENSHOT);
				break;
			case ELEMENT_LEVEL_ACTION.BLACKOUT:
				recordElementAction(ACTIONS_IN_TEST.BLACKOUT);
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
