import { ACTIONS_RECORDING_STATE } from "./actionsRecordingState";
import { iSelectorInfo } from "../utils/selector";

export interface iAttribute {
	name: string;
	value: string;
}

export interface iElementInfo {
	selectors: Array<iSelectorInfo>;
	attributes: Array<iAttribute>;
	innerHTML: string;
}
export interface iRecorderState {
	isInspectModeOn: boolean;
	actionsRecordingState: {
		type: ACTIONS_RECORDING_STATE;
		elementInfo?: iElementInfo | null;
	};
}
