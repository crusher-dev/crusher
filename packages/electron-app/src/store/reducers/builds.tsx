import { AnyAction } from "redux";
import { CLEAR_CURRENT_LOCAL_BUILD, TRIGGER_LOCAL_BUILD, UPDATE_LOCAL_BUILD_RESULT } from "../actions/builds";

export interface ICurrentBuildPayload {
    id: string;
    tests: Array<any>;
    queuedTests: Array<any>;
    time: any;
};

export interface IBuildResultPayload {
    status: "PASSED" | "FAILED" | "RUNNING";
    result?: any;
};

interface IBuildsReducer {
    builds: {
        [id: string]: IBuildResultPayload
    },
	currentBuild: ICurrentBuildPayload | null;
}

const initialState: IBuildsReducer = {
	builds: {},
    currentBuild: null,
};

const buildsReducer = (state: IBuildsReducer = initialState, action: AnyAction) => {
	switch (action.type) {
        case TRIGGER_LOCAL_BUILD:
            return { ...state, currentBuild: action.payload }
        case CLEAR_CURRENT_LOCAL_BUILD:
            return { ...state, currentBuild: null };
        case UPDATE_LOCAL_BUILD_RESULT:
            return { ...state, builds: { ...state.builds, [action.payload.id]: action.payload } };
		default:
			return state;
	}
};

export { IBuildsReducer, buildsReducer };
