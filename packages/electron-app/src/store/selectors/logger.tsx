import { iReduxState } from "../reducers";

export const getLogs = (state: iReduxState) => { console.log("State is", state); return state.logger.logs instanceof Map ? state.logger.logs : new Map([["_", []]]) };
