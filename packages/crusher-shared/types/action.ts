import { ActionsInTestEnum } from "../constants/recordedActions";
import { iSelectorInfo } from "./selectorInfo";

export interface iAction {
	type: ActionsInTestEnum;
	name?: string;
	screenshot?: string;
	payload: {
		timeout?: number;
		selectors?: Array<iSelectorInfo>;
		meta?: any;
	};
	url?: string;
}
