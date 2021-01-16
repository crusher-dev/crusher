import {
	REMOVE_MEMBER,
	SET_MEMBERS,
	SET_PROFILE_INFO,
	UPDATE_MEMBER_ROLE,
} from "@redux/actions/settings";
import IAction from "@interfaces/redux/action";
import { iMember, iProfile } from "@interfaces/redux/settings";
import { iHostListResponse } from "@crusher-shared/types/response/hostListResponse";

export interface iSettingsState {
	profile: iProfile | null;
}

const initialState: iSettingsState = {
	profile: null,
};

const settings = (
	state: iSettingsState = initialState,
	action: IAction<any>,
) => {
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
