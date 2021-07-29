import { ACTIONS_IN_TEST } from "../constants/recordedActions";
import { iSelectorInfo } from "./selectorInfo";

export interface iAction {
	type: ACTIONS_IN_TEST;
	payload: {
		selectors?: Array<iSelectorInfo>;
		meta?: any;
	};
	url?: string;
}
