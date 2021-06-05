import { AnyAction } from "redux";
import { iActionsState } from "../../interfaces/actionsReducer";
import { DELETE_RECORDED_ACTION, RECORD_ACTION, UPDATE_LAST_RECORDED_ACTION } from "../actions/actions";
import { iAction } from "../../../../crusher-shared/types/action";

const initialState: iActionsState = {
	list: [],
	last_action: null,
};

export const actionsReducer = (state: any = initialState, action: AnyAction) => {
	switch (action.type) {
		case RECORD_ACTION:
			return {
				...state,
				list: [...state.list, action.payload.action],
				last_action: new Date(),
			};
		case UPDATE_LAST_RECORDED_ACTION: {
			const newList = state.list;
			newList[newList.length - 1] = action.payload.actionToBeReplacedWith;

			return {
				...state,
				list: newList,
				last_action: new Date(),
			};
		}
		case DELETE_RECORDED_ACTION: {
			const newList = state.list.filter((_: iAction, index: number) => {
				return index !== action.payload.actionIndex;
			});

			return {
				...state,
				list: newList,
			};
		}
		default:
			return state;
	}
};
