import { AxiosRequestConfig } from "axios";
import { getStore } from "electron-app/src/store/configureStore";
import { getCurrentSelectedProjct } from "electron-app/src/store/selectors/app";
import { createAuthorizedRequestFunc, resolveToBackend } from "electron-app/src/utils/url";

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

export { getIntegrationsAPIRequest, removeSlackIntegration, removeGithubIntegration };