import { iReduxState } from "../reducers";
import { iAction } from "../../interfaces/actionsReducer";

export const getActions = (state: iReduxState) => state.actions.list;

export const getLastAction = (state: iReduxState): iAction | null => {
	const actions = getActions(state);
	return actions ? actions[0] : null;
};
