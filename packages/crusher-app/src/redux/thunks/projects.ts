import { backendRequest } from "@utils/backendRequest";
import { iAllProjectsItemResponse } from "@crusher-shared/types/response/allProjectsResponse";

export const fetchProjectsFromServer = (
	headers = null,
): Promise<Array<iAllProjectsItemResponse>> => {
	return backendRequest("/projects/getAll", {
		headers: headers,
	}).then((projects: Array<iAllProjectsItemResponse>) => {
		if (Array.isArray(projects)) {
			return projects;
		} else {
			return [];
		}
	});
};
