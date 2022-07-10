import { ActionsInTestEnum } from "../constants/recordedActions";
import { iSelectorInfo } from "./selectorInfo";
import { ActionStatusEnum as ActionLogStatusEnum } from "../lib/runnerLog/interface";

export enum ActionStatusEnum {
	STARTED = "STARTED",
	SUCCESS = "SUCCESS",
	FAILURE = "FAILURE",
}

export interface iAction {
	uniqueId?: string;
	type: ActionsInTestEnum;
	status?: ActionStatusEnum;
	name?: string;
	screenshot?: string;
	payload: {
		timeout?: number;
		selectors?: Array<iSelectorInfo>;
		meta?: any;
		isOptional?: boolean;
	};
	url?: string;
}

export interface iActionResult {
	actionType: ActionsInTestEnum;
	status: ActionLogStatusEnum;
	message: string;
	meta: any;
}
