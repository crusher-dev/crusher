import { ACTIONS_RECORDING_STATE } from "./actionsRecordingState";
import { ACTIONS_MODAL_STATE } from "./actionsModalState";
import { iSeoMetaInformationMeta } from "src/messageListener";
import { iElementInfo } from "../../../crusher-shared/types/elementInfo";
import { iExecuteScriptOutputResponseMeta } from "../scripts/inject/responseMessageListener";

export interface iRecorderState {
	isInspectModeOn: boolean;
	actionsRecordingState: {
		type: ACTIONS_RECORDING_STATE;
		elementInfo?: iElementInfo | null;
	};
	isRecorderScriptBooted: boolean;
	modalState: ACTIONS_MODAL_STATE | null;
	seoMetaInfo: iSeoMetaInformationMeta | null;
	lastElementExecutionScriptOutput: iExecuteScriptOutputResponseMeta | null;
}
