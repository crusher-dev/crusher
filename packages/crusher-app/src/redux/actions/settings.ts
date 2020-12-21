import { iMember, iProfile } from "@interfaces/redux/settings";

export const SET_PROFILE_INFO = "SET_PROFILE_INFO";
export const UPDATE_PROFILE_INFO = "UPDATE_PROFILE_INFO";

// Members Settings Screen
export const SET_MEMBERS = "SET_MEMBERS";
export const UPDATE_MEMBER_ROLE = "UPDATE_MEMBER_ROLE";
export const REMOVE_MEMBER = "REMOVE_REMEMBER";

export const setMembers = (members: { [memberId: number]: iMember }) => {
	return { type: SET_MEMBERS, payload: { members } };
};

export const updateMemberRole = (role: string, memberId: number) => {
	return { type: UPDATE_MEMBER_ROLE, payload: { role, memberId } };
};

export const removeMember = (memberId: number) => {
	return { type: REMOVE_MEMBER, payload: { memberId } };
};

export const setProfileInfo = (info: iProfile) => {
	return { type: SET_PROFILE_INFO, payload: info };
};
