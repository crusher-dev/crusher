import { AnyAction } from "redux";
import {} from "../actions/recorder";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { iAction } from "@shared/types/action";
import { SET_SHOW_SHOULD_ONBOARDING_OVERLAY } from "../actions/app";

export interface iSettings { 
    autoDetectActions: boolean;
    backendEndPoint: string;
}

export interface ISessionMeta {
	editing: { testId: string } | false;
};

interface IAppReducer {
	settings: iSettings;
	shouldShowOnboardingOverlay: boolean;

	sessionMeta: {
		editing?: ISessionMeta;
	 },
};

const initialState: IAppReducer = {
	settings: { autoDetectActions: true, backendEndPoint: "https://backend.crusher.dev" },
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
		default:
			return state;
	}
};

export {IAppReducer, appReducer};

