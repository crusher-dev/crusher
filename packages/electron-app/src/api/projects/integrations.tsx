import axios, { AxiosRequestConfig } from "axios";
import { CloudCrusher } from "electron-app/src/lib/cloud";
import { getStore } from "electron-app/src/store/configureStore";
import { getCurrentSelectedProjct, getUserAccountInfo } from "electron-app/src/store/selectors/app";
import { createAuthorizedRequestFunc, resolveToBackend } from "electron-app/src/utils/url";
import { getUserInfoAPIRequest } from "../user/user.requests";

const getIntegrationsAPIRequest: () => AxiosRequestConfig = createAuthorizedRequestFunc((authorizationOptions: any) => {
	const store = getStore();
	const projectId = getCurrentSelectedProjct(store.getState() as any);

	return {
		url: resolveToBackend(`/integrations/${projectId}`),
		method: "GET",
		...authorizationOptions,
	};
}, true);

const removeSlackIntegration: () => AxiosRequestConfig = createAuthorizedRequestFunc((authorizationOptions: any) => {
	const store = getStore();
	const projectId = getCurrentSelectedProjct(store.getState() as any);

	return {
		url: resolveToBackend(`/integrations/${projectId}slack/actions/remove`),
		method: "GET",
		...authorizationOptions,
	};
}, true);

const removeGithubIntegration = (integrationId: any) => {
	return createAuthorizedRequestFunc((authorizationOptions: any) => {
		const store = getStore();
		const projectId = getCurrentSelectedProjct(store.getState() as any);
	
		return {
			url: resolveToBackend(`/integrations/${projectId}/github/actions/unlink`),
			method: "POST",
			data: JSON.stringify({
				id: integrationId,
			}),
			...authorizationOptions,
		};
	}, true);
};

const removeVercelIntegration = () => {
	return createAuthorizedRequestFunc((authorizationOptions: any) => {
		const store = getStore();
		const projectId = getCurrentSelectedProjct(store.getState() as any);
	
		return {
			url: resolveToBackend(`/integrations/${projectId}/vercel/actions/disconnect`),
			method: "POST",
			data: JSON.stringify({}),
			...authorizationOptions,
		};
	}, true);
};

const updateProjectMeta = (meta: any) => {
	return createAuthorizedRequestFunc((authorizationOptions: any) => {
		const store = getStore();
		const projectId = getCurrentSelectedProjct(store.getState() as any);

		return {
			url: resolveToBackend(`/projects/${projectId}/actions/update.meta`),
			method: "POST",
			data: {meta},
			...authorizationOptions,
		}
	}, true);
};

const getCurrentProjectMeta = async () => {
	const store = getStore();
	const projectId = getCurrentSelectedProjct(store.getState() as any);
	if(!projectId) throw new Error("No project is selected in the store");

	const userInfo  = await axios(getUserInfoAPIRequest());
	return userInfo.data.projects.find((project: any) => project.id === projectId)?.meta;
};

export { getIntegrationsAPIRequest, removeSlackIntegration, removeGithubIntegration, removeVercelIntegration, updateProjectMeta, getCurrentProjectMeta };