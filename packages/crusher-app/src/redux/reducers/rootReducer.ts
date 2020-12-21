import app from "./app";
import user from "./user";
import projects from "./projects";
import team from "./team";
import lastBuilds from "./lastBuilds";
import { combineReducers } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import job from "@redux/reducers/job";
import testInstance from "@redux/reducers/testInstance";
import IAction from "@interfaces/redux/action";
import settings from "@redux/reducers/settings";

const combinedReducer = combineReducers({
	app,
	user,
	team,
	projects,
	lastBuilds,
	job,
	testInstance,
	settings,
});

const rootReducer = (state: any, action: IAction<any>) => {
	if (action.type === HYDRATE) {
		const nextState = {
			...state, // use previous state
			...action.payload, // apply delta from hydration
		};
		if (state.count) nextState.count = state.count; // preserve count value on client side navigation
		return nextState;
	} else {
		return combinedReducer(state, action);
	}
};

export default rootReducer;
