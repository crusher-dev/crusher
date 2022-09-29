import { AnyAction } from "redux";
import { iAction } from "@shared/types/action";
import {SET_PROXY_INITIALIZING, SET_PROXY_STATE, SET_SELECTED_PROJECT, SET_SESSION_META, SET_SETTINGS, SET_SHOW_SHOULD_ONBOARDING_OVERLAY, SET_USER_ACCOUNT_INFO} from "../actions/app";

export interface iSettings {
	backendEndPoint: string;
	frontendEndPoint: string;
	autoDetectActions: boolean;
	enableMouseTracker: boolean;
}

export interface ISessionMeta {
	editing?: { testId: string } | undefined;
	remainingSteps?: iAction[] | undefined;
}

export interface IProxyState {
	[name: string]: {
		tunnel: string;
		intercept: string;
	};
}

interface IAppReducer {
	settings: iSettings;
	shouldShowOnboardingOverlay: boolean;

	sessionMeta: ISessionMeta;
	accountInfo: any;
	proxy: IProxyState | null;
	proxyIsInitializing: boolean;

	selectedProject: string | null;
}

const initialState: IAppReducer = {
	settings: { autoDetectActions: true, backendEndPoint: "", frontendEndPoint: "", enableMouseTracker: false },
	shouldShowOnboardingOverlay: true,
	sessionMeta: {},
	accountInfo: null,
	proxy: {},
	proxyIsInitializing: false,
};

const appReducer = (state: IAppReducer = initialState, action: AnyAction): IAppReducer => {
	switch (action.type) {
		case SET_SHOW_SHOULD_ONBOARDING_OVERLAY:
			return {
				...state,
				shouldShowOnboardingOverlay: action.payload.shouldShow,
			};
		case SET_USER_ACCOUNT_INFO:
			return {
				...state,
				accountInfo: action.payload.info,
			};
		case SET_SESSION_META:
			return {
				...state,
				sessionMeta: action.payload.sessionMeta,
			};
		case SET_SETTINGS:
			return {
				...state,
				settings: action.payload.settings,
			};
		case SET_PROXY_STATE:
			return {
				...state,
				proxy: action.payload.proxyState,
			};
		case SET_PROXY_INITIALIZING:
			return {
				...state,
				proxyIsInitializing: action.payload.isInitializing,
			};
		case SET_SELECTED_PROJECT:
			return {
				...state,
				selectedProject: action.payload.projectId,
			}
		default:
			return state;
	}
};

export { IAppReducer, appReducer };
