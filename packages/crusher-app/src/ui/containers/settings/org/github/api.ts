import { addGithubRepo, unlinkGithubRepo } from "@constants/api";
import { RequestMethod } from "@types/RequestOptions";
import { backendRequest } from "@utils/common/backendRequest";

export const addGithubProject = (projectId: number, repoData: any) => {
	return backendRequest(addGithubRepo(projectId), {
		method: RequestMethod.POST,
		payload: repoData,
	});
};

export const unlinkRepo = (projectId: number, id: number) => {
	return backendRequest(unlinkGithubRepo(projectId), {
		method: RequestMethod.POST,
		payload: {
			id,
		},
	});
};