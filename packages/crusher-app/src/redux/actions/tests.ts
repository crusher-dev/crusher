import { iLiveStepLogs } from "@crusher-shared/types/mongo/liveStepsLogs";
import { iTestMetaInfo } from "@interfaces/testMetaInfo";

export const RECORD_LIVE_LOG = "RECORD_LIVE_LOG";
export const SAVE_TEST_META_INFO = "SAVE_TEST_META_INFO";
export const MARK_TEST_ABORTED = "MARK_TEST_ABORTED";

export const recordLiveLogs = (logs: iLiveStepLogs[]) => ({
	type: RECORD_LIVE_LOG,
	payload: {
		logs,
	},
});

export const saveTestMetaInfo = (metaInfo: iTestMetaInfo) => ({
	type: SAVE_TEST_META_INFO,
	payload: {
		metaInfo,
	},
});

export const markTestAborted = () => ({
	type: MARK_TEST_ABORTED,
});
