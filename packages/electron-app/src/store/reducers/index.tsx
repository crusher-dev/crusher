import { AnyAction, CombinedState, combineReducers, Reducer } from "redux";
import { IOnboardingState, onboardingReducer } from "./onboarding";

export interface iReduxState {
    onboarding: IOnboardingState;
}

// Use ES6 object literal shorthand syntax to define the object shape
const rootReducer: Reducer<CombinedState<iReduxState>, AnyAction> = combineReducers({
    onboarding: onboardingReducer
});

export { rootReducer };
