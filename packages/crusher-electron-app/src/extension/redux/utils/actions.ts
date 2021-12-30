import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { iAction } from "@shared/types/action";
import { ACTIONS_RECORDING_STATE } from "../../interfaces/actionsRecordingState";
import { recordAction } from "../actions/actions";
import { getActionsRecordingState } from "../selectors/recorder";
import { getStore } from "../store";

export const recordActionWithHoverNodes = (action: iAction) => {
	const store = getStore();
	const actionRecordingState = getActionsRecordingState(store.getState());

	if (actionRecordingState.hoverDependentSelectors && actionRecordingState.type === ACTIONS_RECORDING_STATE.ELEMENT) {
		for (const hoverElementSelector of actionRecordingState.hoverDependentSelectors) {
			if (hoverElementSelector.selectors === action.payload.selectors) continue;

			store.dispatch(
				recordAction({
					type: ActionsInTestEnum.HOVER,
					payload: {
						// Weird typescript error here
						selectors: hoverElementSelector.selectors as any,
						meta: {},
					},
					screenshot: null,
					//@TODO: Get the url of the target site here (Maybe some hack with atom or CEF)
					url: "",
				}),
			);
		}
	}
	store.dispatch(recordAction(action));
};
