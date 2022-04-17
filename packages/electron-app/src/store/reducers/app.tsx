import { AnyAction } from "redux";
import {} from "../actions/recorder";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { iAction } from "@shared/types/action";
import { RESET_APP_SESSION, SET_SESSION_META, SET_SETTINGS, SET_SHOW_SHOULD_ONBOARDING_OVERLAY, SET_USER_ACCOUNT_INFO } from "../actions/app";

export interface iSettings {
	backendEndPoint: string;
	frontendEndPoint: string;
	autoDetectActions: boolean;
	enableMouseTracker: boolean;
}

export interface ISessionMeta {
	editing?: { testId: string } | undefined;
	remainingSteps?: Array<iAction> | undefined;
}

interface IAppReducer {
	settings: iSettings;
	shouldShowOnboardingOverlay: boolean;

	sessionMeta: ISessionMeta;
	accountInfo: any;
}

const initialState: IAppReducer = {
	settings: { autoDetectActions: true, backendEndPoint: "", frontendEndPoint: "", enableMouseTracker: false },
	shouldShowOnboardingOverlay: true,
	sessionMeta: {},
	accountInfo: null,
};

const appReducer = (state: IAppReducer = initialState, action: AnyAction) => {
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
		default:
			return state;
	}
};

export { IAppReducer, appReducer };
