import produce from "immer";
import { atom } from "jotai";

import { updateProjectAPI, updateTeamMetaAPI, updateUserMetaAPI } from "@constants/api";
import { backendRequest } from "@utils/common/backendRequest";

import { RequestMethod } from "../../types/RequestOptions";
import { appStateAtom } from "../atoms/global/appState";
import { projectsAtom } from "../atoms/global/project";
import { teamAtom } from "../atoms/global/team";
import { userAtom } from "../atoms/global/user";

interface IUpdateUserOnboarding {
	type: "user" | "team" | "project";
	key: string;
	value: any;
}

const updateUserMeta = (meta: Record<string, any>) => {
	return backendRequest(updateUserMetaAPI(), {
		method: RequestMethod.POST,
		payload: {
			meta,
		},
	});
};

const updateProjectMeta = (projectId: number, meta: Record<string, any>) => {
	return backendRequest(updateProjectAPI(projectId), {
		method: RequestMethod.POST,
		payload: {
			meta,
		},
	});
};

const updateTeamMeta = (meta: Record<string, any>) => {
	return backendRequest(updateTeamMetaAPI(), {
		method: RequestMethod.POST,
		payload: {
			meta,
		},
	});
};

/*
	Add API filteration to not call API when key-value pair is same.
 */
export const updateMeta = atom(
	null,
	(_get, _set, passedPayload: { callback?: any; } & (IUpdateUserOnboarding | { type: IUpdateUserOnboarding["type"]; values: Array<Omit<IUpdateUserOnboarding, "type">>; })) => {
		let callback: any = undefined;
		if(passedPayload.callback) { callback = passedPayload.callback; delete passedPayload.callback; }
		
		const { selectedProjectId } = _get(appStateAtom);
		let payload = {};
		const { type } = passedPayload;
		//@ts-ignore
		if (passedPayload.values) {
			//@ts-ignore
			payload = passedPayload.values.reduce((acc, cur) => {
				return {
					...acc,
					[String(cur.key)]: cur.value,
				};
			}, {});
		} else if (passedPayload instanceof Object) {
			//@ts-ignore
			const { key, value, type } = passedPayload;
			payload = { [String(key)]: value };
		}
		switch (type) {
			case "project":
				{
					const project = _get(projectsAtom);
					const newState = produce(project, (draftProjects) => {
						for (const project of draftProjects) {
							if (project.id === selectedProjectId) {
								project["meta"] = { ...project["meta"], ...payload };
							}
						}
					});
					_set(projectsAtom, newState);

					updateProjectMeta(selectedProjectId, payload).finally(() => {
						if(callback) { callback(); }
					});
				}
				break;

			case "team":
				{
					const team = _get(teamAtom);
					const newState = produce(team, (newState) => {
						if (newState === null) {
							newState = {};
						}
						// @ts-ignore
						newState["meta"] = { ...newState["meta"], ...payload };
					});
					_set(teamAtom, newState);
					updateTeamMeta(payload).finally(() => {
						if(callback) { callback(); }
					});
				}
				break;

			case "user":
				{
					const user = _get(userAtom);
					const newState = produce(user, (newState) => {
						if (newState === null) {
							newState = {};
						}
						// @ts-ignore
						newState["meta"] = { ...newState["meta"], ...payload };
					});
					_set(userAtom, newState);
					updateUserMeta(payload).finally(() => {
						if(callback) { callback(); }
					});
				}
				break;
		}

	},
);
