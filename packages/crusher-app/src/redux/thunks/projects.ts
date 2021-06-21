import { backendRequest } from "@utils/backendRequest";
import { iAllProjectsItemResponse } from "@crusher-shared/types/response/allProjectsResponse";

export const fetchProjectsFromServer = (headers = null): Promise<iAllProjectsItemResponse[]> => {
	return backendRequest("/projects/getAll", {
		headers: headers,
	}).then((projects: iAllProjectsItemResponse[]) => {
		if (Array.isArray(projects)) {
			return projects;
		} else {
			return [];
		}
	});
};
