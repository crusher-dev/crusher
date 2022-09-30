import { AnyAction, CombinedState, combineReducers, Reducer } from "redux";
import { appReducer, IAppReducer } from "./app";
import { loggerReducer, ILoggerReducer } from "./logger";
import { IOnboardingState, onboardingReducer } from "./onboarding";
import { IRecorderReducer, recorderReducer } from "./recorder";
import { buildsReducer, IBuildsReducer } from "./builds";

export interface iReduxState {
	onboarding: IOnboardingState;
	recorder: IRecorderReducer;
	app: IAppReducer;
	logger: ILoggerReducer;
	builds: IBuildsReducer;
}

// Use ES6 object literal shorthand syntax to define the object shape
const rootReducer: Reducer<CombinedState<iReduxState>, AnyAction> = combineReducers({
	onboarding: onboardingReducer,
	recorder: recorderReducer,
	app: appReducer,
	logger: loggerReducer,
	builds: buildsReducer,
});

export { rootReducer };
