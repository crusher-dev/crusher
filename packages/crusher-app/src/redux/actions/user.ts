import { iUserInfoResponse } from "@crusher-shared/types/response/userInfoResponse";

export const SET_USER_LOGGED_IN = "SET_USER_LOGGED_IN";
export const USER_LOGOUT = "USER_LOGOUT";

export const setUserLoggedIn = (info: iUserInfoResponse) => {
	return {
		type: SET_USER_LOGGED_IN,
		info,
	};
};

export const logoutUser = () => {
	return {
		type: USER_LOGOUT,
	};
};
