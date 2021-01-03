import { AnyAction } from "redux";
import { iActionsState } from "../../interfaces/actionsReducer";
import { RECORD_ACTION } from "../actions/actions";

const initialState: iActionsState = {
	list: [],
	last_action: null,
};

export const actionsReducer = (
	state: any = initialState,
	action: AnyAction,
) => {
	switch (action.type) {
		case RECORD_ACTION:
			return {
				...state,
				list: [...state.list, action.payload.action],
				last_action: new Date(),
			};
		default:
			return state;
	}
};
