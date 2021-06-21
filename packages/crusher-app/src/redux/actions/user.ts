import { iUserInfoResponse } from "@crusher-shared/types/response/userInfoResponse";
import { iUserConnection } from "@crusher-shared/types/mongo/userConnection";

export const SET_USER_LOGGED_IN = "SET_USER_LOGGED_IN";
export const USER_LOGOUT = "USER_LOGOUT";
export const SET_USER_LOGIN_CONNECTIONS = "SET_USER_LOGIN_CONNECTIONS";
export const DELETE_USER_LOGIN_CONNECTION = "DELETE_USER_LOGIN_CONNECTION";

export const setUserLoggedIn = (info: iUserInfoResponse) => {
	return {
		type: SET_USER_LOGGED_IN,
		info,
	};
};

export const setUserLoginConnections = (connections: iUserConnection[]) => ({
	type: SET_USER_LOGIN_CONNECTIONS,
	payload: { connections },
});

export const logoutUser = () => {
	return {
		type: USER_LOGOUT,
	};
};

export const deleteUserConnection = (connectionId: string) => {
	return {
		type: DELETE_USER_LOGIN_CONNECTION,
		payload: { connectionId },
	};
};
