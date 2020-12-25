import { backendRequest, cleanHeaders } from "@utils/backendRequest";
import { saveProjectsInRedux } from "@redux/actions/project";
import { emitter } from "@utils/mitt";

export const fetchProjectsFromServer: any = (headers: headers) => {
	return backendRequest("/projects/getAll", {
		headers: headers,
	}).then((projects: Array<any>) => {
		if (Array.isArray(projects)) {
			return projects;
		} else {
			return [];
		}
	});
};
