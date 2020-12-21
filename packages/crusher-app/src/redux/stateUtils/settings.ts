import { iSettingsState } from "@redux/reducers/settings";

export const getProjectMembers = (state: iSettingsState) =>
	Object.values(state);

export const getProfileInfo = (state: iSettingsState) => state.profile;
