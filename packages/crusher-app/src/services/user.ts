import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";
import { iUserInfoResponse } from "@crusher-shared/types/response/userInfoResponse";
import { iInviteReferral } from "@crusher-shared/types/inviteReferral";

export const _authenticateUser = (email: string, password: string) => {
	return backendRequest("/user/login", {
		method: RequestMethod.POST,
		payload: { email, password },
	});
};

export const _createTeam = (teamName: string) => {
	return backendRequest("/user/createTeam", {
		method: RequestMethod.POST,
		payload: { teamName },
	});
};

export const _createTeamBackend = (teamName: string, headers: any = null) => {
	return backendRequest("/user/createTeam", {
		method: RequestMethod.POST,
		headers: headers,
		payload: { teamName },
	});
};

export const _registerUser = (
	firstName: string,
	lastName: string,
	email: string,
	password: string,
	inviteReferral: iInviteReferral | null = null,
) => {
	return backendRequest("/user/signup", {
		method: RequestMethod.POST,
		payload: {
			firstName,
			lastName,
			email,
			password,
			inviteReferral,
		},
	});
};

export const _addUserMeta = (data: Array<any>) => {
	return backendRequest("/user/meta/add", {
		method: RequestMethod.POST,
		payload: data,
	});
};

export const _verifyUser = (code: string, headers: any) => {
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
	}).then((res: iUserInfoResponse) => {
		return {
			...res,
		};
	});
};
