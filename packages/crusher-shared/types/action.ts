import { ActionsInTestEnum } from "../constants/recordedActions";
import { iSelectorInfo } from "./selectorInfo";

export interface iAction {
	type: ActionsInTestEnum;
	payload: {
		selectors?: Array<iSelectorInfo>;
		meta?: any;
	};
	url?: string;
}
