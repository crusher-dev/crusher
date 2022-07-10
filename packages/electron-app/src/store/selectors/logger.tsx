import { iReduxState } from "../reducers";

export const getLogs = (state: iReduxState) => state.logger.logs;
