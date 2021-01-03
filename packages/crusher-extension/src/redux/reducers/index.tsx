import { AnyAction, CombinedState, combineReducers, Reducer } from "redux";
import { actionsReducer } from "./actions";
import { iActionsState } from "../../interfaces/actionsReducer";
import { recorderReducer } from "./recorder";
import { iRecorderState } from "../../interfaces/recorderReducer";

export interface iReduxState {
	actions: iActionsState;
	recorder: iRecorderState;
}

// Use ES6 object literal shorthand syntax to define the object shape
const rootReducer: Reducer<
	CombinedState<iReduxState>,
	AnyAction
> = combineReducers({
	actions: actionsReducer,
	recorder: recorderReducer,
});

export { rootReducer };
