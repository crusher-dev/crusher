import { AnyAction, CombinedState, combineReducers, Reducer } from "redux";
import { onboardingReducer } from "./onboarding";

export interface iReduxState {
}

// Use ES6 object literal shorthand syntax to define the object shape
const rootReducer: Reducer<CombinedState<iReduxState>, AnyAction> = combineReducers({
    onboardingReducer
});

export { rootReducer };
