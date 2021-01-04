import { ACTIONS_RECORDING_STATE } from "./actionsRecordingState";
import { ACTIONS_MODAL_STATE } from "./actionsModalState";
import { iSeoMetaInformationMeta } from "src/messageListener";
import { iElementInfo } from "../../../crusher-shared/types/elementInfo";

export interface iRecorderState {
	isInspectModeOn: boolean;
	actionsRecordingState: {
		type: ACTIONS_RECORDING_STATE;
		elementInfo?: iElementInfo | null;
	};
	isRecorderScriptBooted: boolean;
	modalState: ACTIONS_MODAL_STATE | null;
	seoMetaInfo: iSeoMetaInformationMeta | null;
}
