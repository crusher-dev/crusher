import { iLiveStepLogs } from '../mongo/liveStepsLogs';
import { InstanceStatus } from '../instanceStatus';
import { iTestInstanceRecording } from '../db/testInstanceRecording';
import { iDraftInstanceResult } from '../db/draftInstanceResult';

export enum DRAFT_LOGS_STATUS{
	NO_UPDATE="NO_UPDATE",
	UPDATE_LOGS="UPDATE_LOGS"
};

export interface iDraftLogsResponse{
	status: DRAFT_LOGS_STATUS,
	logs?: iLiveStepLogs[],
	test: {
		status: InstanceStatus,
		result: iDraftInstanceResult,
		testInstanceRecording?: iTestInstanceRecording
	}
};
