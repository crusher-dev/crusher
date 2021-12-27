import { AnyAction } from "redux";
import {} from "../actions/recorder";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { iAction } from "@shared/types/action";
import { SET_SHOW_SHOULD_ONBOARDING_OVERLAY } from "../actions/app";

export interface iSettings { 
    autoDetectActions: boolean;
    backendEndPoint: string;
}


interface IAppReducer {
	settings: iSettings;
	shouldShowOnboardingOverlay: boolean;
};

const initialState: IAppReducer = {
	settings: { autoDetectActions: true, backendEndPoint: "https://backend.crusher.dev" },
	shouldShowOnboardingOverlay: true
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

