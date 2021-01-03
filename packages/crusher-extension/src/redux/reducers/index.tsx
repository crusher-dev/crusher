import { AnyAction, CombinedState, combineReducers, Reducer } from "redux";
import { actionsReducer } from "./actions";
import { iActionsReducer } from "../../interfaces/actionsReducer";

export interface iReduxState {
	actions: iActionsReducer;
}

// Use ES6 object literal shorthand syntax to define the object shape
const rootReducer: Reducer<
	CombinedState<iReduxState>,
	AnyAction
> = combineReducers({
	actions: actionsReducer,
});

export { rootReducer };
