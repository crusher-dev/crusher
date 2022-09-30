import { AnyAction } from "redux";
import { CLEAR_LOGS, RECORD_LOG } from "../actions/logger";
import { RESET_RECORDER } from "../actions/recorder";

export interface ILog {
	id: string;
	type: "log" | "info" | "error";
	parent?: string;
	message: string;
	args: any[];
	time: number;
}

interface ILoggerReducer {
	logs: Map<string, ILog[]>;
}

const initialState: ILoggerReducer = {
	logs: new Map([["_", []]]),
};

const loggerReducer = (state: ILoggerReducer = initialState, action: AnyAction) => {
	switch (action.type) {
		case RECORD_LOG:
			return {
				...state,
				logs: action.payload,
			};
		case CLEAR_LOGS:
		case RESET_RECORDER:
			return {
				...state,
				logs: new Map([["_", []]]),
			};
		default:
			return state;
	}
};

export { ILoggerReducer, loggerReducer };
