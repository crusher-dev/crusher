import { UserInfo } from "@interfaces/userInfo";

export const SET_USER_LOGGED_IN = "SET_USER_LOGGED_IN";
export const USER_LOGOUT = "USER_LOGOUT";

export const setUserLoggedIn = (info: UserInfo) => {
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
