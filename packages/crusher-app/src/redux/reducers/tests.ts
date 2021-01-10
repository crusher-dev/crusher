import { iLiveStepLogs } from "@crusher-shared/types/mongo/liveStepsLogs";
import { SAVE_TEST_META_INFO, RECORD_LIVE_LOG } from "@redux/actions/tests";
import { iTestMetaInfo } from "@interfaces/testMetaInfo";

interface iTestsState {
	liveLogs: Array<iLiveStepLogs>;
	metaInfo: iTestMetaInfo | null;
}
const initialData: iTestsState = {
	liveLogs: [],
	metaInfo: null,
};

const tests = (state = initialData, action: any) => {
	switch (action.type) {
		case RECORD_LIVE_LOG:
			return {
				...state,
				liveLogs: [...state.liveLogs, ...action.payload.logs],
			};
		case SAVE_TEST_META_INFO:
			return {
				...state,
				metaInfo: action.payload.metaInfo,
				liveLogs: [],
			};
		default:
			return state;
	}

	return state;
};

export default tests;
