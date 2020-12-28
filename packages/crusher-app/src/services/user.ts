import { backendRequest } from "@utils/backendRequest";
import { USER_NOT_REGISTERED } from "@utils/constants";
import { RequestMethod } from "@interfaces/RequestOptions";
import { User } from "crusher-server/crusher-server/src/core/interfaces/db/User";
import { iUserInfoResponse } from "@crusher-shared/types/response/userInfoResponse";

export const _authenticateUser = (email, password) => {
	return backendRequest("/user/login", {
		method: RequestMethod.POST,
		payload: { email, password },
	});
};

export const _createTeam = (teamName) => {
	return backendRequest("/user/createTeam", {
		method: RequestMethod.POST,
		payload: { teamName },
	});
};

export const _createTeamBackend = (teamName, headers) => {
	return backendRequest("/user/createTeam", {
		method: RequestMethod.POST,
		headers: headers,
		payload: { teamName },
	});
};

export const _registerUser = (firstName, lastName, email, password) => {
	return backendRequest("/user/signup", {
		method: RequestMethod.POST,
		payload: { firstName, lastName, email, password },
	});
};

export const _addUserMeta = (data: Array<any>) => {
	return backendRequest("/user/meta/add", {
		method: RequestMethod.POST,
		payload: data,
	});
};

export const _verifyUser = (code, headers) => {
	return backendRequest("/user/verify", {
		method: RequestMethod.POST,
		headers: headers,
		payload: { code },
	});
};

export const _resendVerification = (headers = null) => {
	return backendRequest("/user/resendVerification", {
		method: RequestMethod.POST,
		headers: headers,
	});
};

export const _fetchUserStatus = (headers = null) => {
	return backendRequest("/user/getStatus", {
		headers: headers,
	}).then((res: any) => {
		return res;
	});
};

export const _fetchUserInfo = (headers = null): Promise<iUserInfoResponse> => {
	return backendRequest("/user/info", {
		headers: headers,
	}).then((res: User) => {
		return {
			...res,
		};
	});
};
