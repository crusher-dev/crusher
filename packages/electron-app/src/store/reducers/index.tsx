import { AnyAction, CombinedState, combineReducers, Reducer } from "redux";
import { appReducer, IAppReducer } from "./app";
import { IOnboardingState, onboardingReducer } from "./onboarding";
import { IRecorderReducer, recorderReducer } from "./recorder";

export interface iReduxState {
    onboarding: IOnboardingState;
    recorder: IRecorderReducer;
    app: IAppReducer;
}

// Use ES6 object literal shorthand syntax to define the object shape
const rootReducer: Reducer<CombinedState<iReduxState>, AnyAction> = combineReducers({
    onboarding: onboardingReducer,
    recorder: recorderReducer,
    app: appReducer
});

export { rootReducer };
