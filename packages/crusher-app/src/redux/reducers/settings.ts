import {
	REMOVE_MEMBER,
	SET_MEMBERS,
	SET_PROFILE_INFO,
	UPDATE_MEMBER_ROLE,
} from "@redux/actions/settings";
import IAction from "@interfaces/redux/action";
import { iMember, iProfile } from "@interfaces/redux/settings";

export interface iSettingsState {
	profile: iProfile | null;
	members: { [memberId: number]: iMember } | null;
}

const initialState: iSettingsState = {
	profile: null,
	members: null,
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
		case SET_MEMBERS:
			return {
				...state,
				members: payload.members,
			};
		case UPDATE_MEMBER_ROLE: {
			const _newMembers = Object.assign({}, state.members);
			_newMembers[payload.memberId].role = payload.role;

			return {
				...state,
				members: _newMembers,
			};
		}
		case REMOVE_MEMBER: {
			const _newMembers = Object.assign({}, state.members);
			delete _newMembers[payload.memberId];

			return {
				...state,
				members: _newMembers,
			};
		}
		default:
			return state;
	}
};

export default settings;
