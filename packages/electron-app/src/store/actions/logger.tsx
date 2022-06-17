import { ILoggerReducer } from "../reducers/logger";

export const CLEAR_LOGS = "CLEAR_LOGS";
export const RECORD_LOG = "RECORD_LOG";

export const clearLogs = () => {
	return {
		type: CLEAR_LOGS,
	};
};

export const recordLog = (payload: ILoggerReducer["logs"][0]) => {
	return {
		type: RECORD_LOG,
		payload: payload,
	};
};
