import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";
import { iListOfUserLoginConnectionsResponse } from "@crusher-shared/types/response/listOfUserLoginConnections";
import { iLinkGithubRepoRequest } from "@crusher-shared/types/request/linkGithubRepoRequest";
import { linkGithubRepoResponse } from "@crusher-shared/types/response/linkGithubRepoResponse";
import { iGithubLinkedReposListResponse } from "@crusher-shared/types/response/githubLinkedReposListResponse";

export const _getUserConnectionsList = (
	headers: any = null,
): Promise<iListOfUserLoginConnectionsResponse> => {
	return backendRequest("/v2/user/connection/get", {
		method: RequestMethod.GET,
		headers: headers,
	});
};

export const _linkGithubRepo = (
	request: iLinkGithubRepoRequest,
	headers: any = null,
): Promise<linkGithubRepoResponse> => {
	return backendRequest("/github/link", {
		method: RequestMethod.POST,
		headers: headers,
		payload: request,
	});
};

export const _getLinkedGithubRepos = (
	projectId: number,
	headers: any = null,
): Promise<iGithubLinkedReposListResponse> => {
	return backendRequest(`/github/repos/list/${projectId}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

export const _unlinkGithubRepo = (
	integrationId: string,
	headers: any = null,
) => {
	return backendRequest(`/github/repos/unlink/${integrationId}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};
