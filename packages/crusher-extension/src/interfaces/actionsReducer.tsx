import { ACTIONS_IN_TEST } from "../../../crusher-shared/constants/recordedActions";
import { iSelectorInfo } from "../utils/selector";

export interface iAction {
	type: ACTIONS_IN_TEST;
	payload: {
		selectors?: Array<iSelectorInfo>;
		meta?: any;
	};
	url?: string;
}

export interface iActionsState {
	list: Array<iAction>;
	last_action: Date | null;
}
