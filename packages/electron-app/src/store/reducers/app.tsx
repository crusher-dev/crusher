import { AnyAction } from "redux";
import {} from "../actions/recorder";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { iAction } from "@shared/types/action";
import { SET_SESSION_META, SET_SETTINGS, SET_SHOW_SHOULD_ONBOARDING_OVERLAY } from "../actions/app";

export interface iSettings { 
    backendEndPoint: string;
	frontendEndPoint: string;
	autoDetectActions: boolean;
	enableMouseTracker: boolean;
}

export interface ISessionMeta {
	editing?: { testId: string } | undefined;
};

interface IAppReducer {
	settings: iSettings;
	shouldShowOnboardingOverlay: boolean;

	sessionMeta: ISessionMeta;
};

const initialState: IAppReducer = {
	settings: { autoDetectActions: true, backendEndPoint: "", frontendEndPoint: "", enableMouseTracker: false },
	shouldShowOnboardingOverlay: true, 
	sessionMeta: {}
};

const appReducer = (state: IAppReducer = initialState, action: AnyAction) => {
	switch (action.type) {
		case SET_SHOW_SHOULD_ONBOARDING_OVERLAY:
			return {
				...state,
				shouldShowOnboardingOverlay: action.payload.shouldShow,
			}
		case SET_SESSION_META:
			return {
				...state,
				sessionMeta: action.payload.sessionMeta
			}
		case SET_SETTINGS:
			return {
				...state,
				settings: action.payload.settings
			}
		default:
			return state;
	}
};

export {IAppReducer, appReducer};

