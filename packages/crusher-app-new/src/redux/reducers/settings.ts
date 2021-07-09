import { SET_PROFILE_INFO } from "@redux/actions/settings";
import IAction from "@interfaces/redux/action";
import { iProfile } from "@interfaces/redux/settings";

export interface iSettingsState {
	profile: iProfile | null;
}

const initialState: iSettingsState = {
	profile: null,
};

const settings = (state: iSettingsState = initialState, action: IAction<any>) => {
	const { type, payload } = action;

	switch (type) {
		case SET_PROFILE_INFO:
			return {
				...state,
				profile: {
					name: payload.name,
					email: payload.email,
				},
			};

		default:
			return state;
	}
};

export default settings;
