import { AnyAction } from "redux";
import { CLEAR_LOGS, RECORD_LOG } from "../actions/logger";
import { RESET_RECORDER } from "../actions/recorder";

interface ILoggerReducer {
	logs: Array<{ id: string; type: "log" | "info" | "error"; parent?: string | null; message: string; args: Array<any>; time: number }>;
}

const initialState: ILoggerReducer = {
	logs: [],
};

const loggerReducer = (state: ILoggerReducer = initialState, action: AnyAction) => {
	switch (action.type) {
		case RECORD_LOG:
			return {
				...state,
				logs: [...state.logs, action.payload],
			};
		case CLEAR_LOGS:
		case RESET_RECORDER:
			return {
				...state,
				logs: [],
			};
		default:
			return state;
	}
};

export { ILoggerReducer, loggerReducer };
