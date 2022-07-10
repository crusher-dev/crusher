import { AnyAction } from "redux";
import { MARK_ONBOARDING_COMPLETE, SET_CURRENT_ONBOARDING_STEP } from "../actions/onboarding";

export interface IOnboardingState {
	isComplete: boolean;
	currentStep: number;
}

const initialState: IOnboardingState = {
	isComplete: false,
	currentStep: 0,
};

export const onboardingReducer = (state: any = initialState, action: AnyAction) => {
	switch (action.type) {
		case MARK_ONBOARDING_COMPLETE:
			return {
				...state,
				isComplete: true,
			};
		case SET_CURRENT_ONBOARDING_STEP:
			return {
				...state,
				currentStep: action.payload.step,
			};
		default:
			return state;
	}
};
