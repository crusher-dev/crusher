import { AnyAction } from "redux";
import { CLEAR_CURRENT_LOCAL_BUILD, TRIGGER_LOCAL_BUILD, UPDATE_LOCAL_BUILD_RESULT, UPDATE_CURRENT_LOCAL_BUILD, ADD_BUILD_NOTIFICATION, CLEAR_BUILD_NOTIFICATIONS, REMOVE_BUILD_NOTIFICATION, UPDATE_BUILD_NOTIIFICATION } from "../actions/builds";

export interface ICurrentBuildPayload {
    id: string;
    tests: any[];
    queuedTests: any[];
    time: any;
};

export interface IBuildResultPayload {
    status: "PASSED" | "FAILED" | "RUNNING";
    result?: any;
};


export interface IBuildNotification {
    id: string;
    status: "PASSED" | "FAILED" | "RUNNING";
    meta: any;
    time: any;  
};
interface IBuildsReducer {
    builds: {
        [id: string]: IBuildResultPayload
    },
	currentBuild: ICurrentBuildPayload | null;
    notifications: IBuildNotification[];
}

const initialState: IBuildsReducer = {
	builds: {},
    currentBuild: null,
    notifications: [],
};

const buildsReducer = (state: IBuildsReducer = initialState, action: AnyAction) => {
	switch (action.type) {
        case TRIGGER_LOCAL_BUILD:
            return { ...state, currentBuild: action.payload }
        case UPDATE_CURRENT_LOCAL_BUILD:
            return { ...state, currentBuild: { ...state.currentBuild, ...action.payload } }
        case CLEAR_CURRENT_LOCAL_BUILD:
            return { ...state, currentBuild: null };
        case UPDATE_LOCAL_BUILD_RESULT:
            return { ...state, builds: { ...state.builds, [action.payload.id]: action.payload } };
        case ADD_BUILD_NOTIFICATION:
            return { ...state, notifications: [...state.notifications, action.payload] };
        case UPDATE_BUILD_NOTIIFICATION:
            return {
                ...state,
                notifications: state.notifications.map((notification) => {
                    if (notification.id === action.payload.buildId) {
                        return { ...notification, ...action.payload.meta };
                    }
                    return notification;
                })
            };
        case REMOVE_BUILD_NOTIFICATION:
            return { ...state, notifications: state.notifications.filter((n) => n.id !== action.payload) };
        case CLEAR_BUILD_NOTIFICATIONS:
            return { ...state, notifications: [] };
		default:
			return state;
	}
};

export { IBuildsReducer, buildsReducer };
