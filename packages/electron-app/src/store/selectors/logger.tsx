import { iReduxState } from "../reducers";

export const getLogs = (state: iReduxState) => {
	return state.logger.logs instanceof Map ? state.logger.logs : new Map([["_", []]]);
};
