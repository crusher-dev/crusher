import { backendRequest, cleanHeaders } from "@utils/backendRequest";
// import { setHostsInState, saveProjectsInRedux } from '../actions/action';
import { getAllHosts } from "@services/projects";
import { saveProjectsInRedux } from "@redux/actions/action";
import { emitter } from "@utils/mitt";

export const fetchProjectsFromServer: any = (headers: any = null) => (
	dispatch: any,
) => {
	cleanHeaders(headers);

	return backendRequest("/projects/getAll", {
		headers: headers,
	})
		.then((projects: Array<any>) => {
			if (Array.isArray(projects)) {
				dispatch(saveProjectsInRedux(projects));
			} else {
				dispatch(saveProjectsInRedux([]));
			}
		})
		.catch((err: Error) => {
			dispatch(saveProjectsInRedux([]));
			emitter.emit("error", {
				type: "bad-request",
				error: err,
				message: "Something went wrong while fetching the projects",
			});
		});
};

export const fetchAllHostsOfProjectFromServer = (projectId, headers = null) => (
	dispatch,
) => {
	return getAllHosts(projectId, headers)
		.then((hosts) => {
			// dispatch(setHostsInState(hosts, projectId));
		})
		.catch((err) => {
			// dispatch(setHostsInState([], projectId));
		});
};
