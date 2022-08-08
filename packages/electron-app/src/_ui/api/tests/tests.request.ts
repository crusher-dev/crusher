import axios, { AxiosRequestConfig } from "axios";
import { getStore } from "electron-app/src/store/configureStore";
import { getCurrentSelectedProjct } from "electron-app/src/store/selectors/app";
import { createAuthorizedRequestFunc, resolveToBackend } from "electron-app/src/utils/url";

const getSelectedProjectTestsRequest: () => AxiosRequestConfig = createAuthorizedRequestFunc((authorizationOptions: any) => {
	const store = getStore();
	const selectedProject = getCurrentSelectedProjct(store.getState() as any);
	if(!selectedProject) return null;

	return {
		url: resolveToBackend(`/projects/${selectedProject}/tests`),
		method: "GET",
		...authorizationOptions,
	};
}, true);

export { getSelectedProjectTestsRequest }; 