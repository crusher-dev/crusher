import { ACTIONS_RECORDING_STATE } from "./actionsRecordingState";
import { ACTIONS_MODAL_STATE } from "./actionsModalState";
import { iSeoMetaInformationMeta } from "../messageListener";
import { iElementInfo } from "@shared/types/elementInfo";
import { iExecuteScriptOutputResponseMeta } from "../scripts/inject/responseMessageListener";
import { iSelectorInfo } from "@shared/types/selectorInfo";

export interface iRecorderState {
	isInspectModeOn: boolean;
	actionsRecordingState: {
		type: ACTIONS_RECORDING_STATE;
		hoverDependentSelectors?: Array<{ selectors: iSelectorInfo[] }>;
		elementInfo?: iElementInfo | null;
	};
	isAutoRecordOn: boolean;
	isRecorderOn: boolean;
	isRecorderScriptBooted: boolean;
	modalState: ACTIONS_MODAL_STATE | null;
	seoMetaInfo: iSeoMetaInformationMeta | null;
	lastElementExecutionScriptOutput: iExecuteScriptOutputResponseMeta | null;
}
