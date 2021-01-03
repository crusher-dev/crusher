import { iReduxState } from "../reducers";

export const getActions = (state: iReduxState) => state.actions.list;
