import { backendRequest } from "@utils/backendRequest";
import { USER_NOT_REGISTERED } from "@utils/constants";
import { RequestMethod } from "@interfaces/RequestOptions";

export const authenticateUser = (email, password) => {
	return backendRequest("/user/login", {
		method: RequestMethod.POST,
		payload: { email, password },
	});
};

export const createTeam = (teamName) => {
	return backendRequest("/user/createTeam", {
		method: RequestMethod.POST,
		payload: { teamName },
	});
};

export const createTeamBackend = (teamName, headers) => {
	return backendRequest("/user/createTeam", {
		method: RequestMethod.POST,
		headers: headers,
		payload: { teamName },
	});
};

export const registerUser = (firstName, lastName, email, password) => {
	return backendRequest("/user/signup", {
		method: RequestMethod.POST,
		payload: { firstName, lastName, email, password },
	});
};

export const addUserMeta = (data: Array<any>) => {
	return backendRequest("/user/meta/add", {
		method: RequestMethod.POST,
		payload: data,
	});
};

export const verifyUser = (code, headers) => {
	return backendRequest("/user/verify", {
		method: RequestMethod.POST,
		headers: headers,
		payload: { code },
	});
};

export const resendVerification = (headers = null) => {
	return backendRequest("/user/resendVerification", {
		method: RequestMethod.POST,
		headers: headers,
	});
};

export const getUserStatus = (headers = null) => {
	return backendRequest("/user/getStatus", {
		headers: headers,
	})
		.then((res) => {
			return res;
		})
		.catch((err) => {
			return USER_NOT_REGISTERED;
		});
};

export const getUserInfo = (headers = null) => {
	return backendRequest("/user/info", {
		headers: headers,
	}).then((res) => {
		return {
			...res,
			name: res.first_name + " " + res.last_name,
		};
	});
};
