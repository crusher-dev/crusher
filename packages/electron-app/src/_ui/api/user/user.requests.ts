import axios, { AxiosRequestConfig } from "axios";
import { getStore } from "electron-app/src/store/configureStore";
import { getCurrentSelectedProjct } from "electron-app/src/store/selectors/app";
import { createAuthorizedRequestFunc, resolveToBackend } from "electron-app/src/utils/url";


const getUserInfoAPIRequest: () => AxiosRequestConfig = createAuthorizedRequestFunc((authorizationOptions: any) => {
	return {
		url: resolveToBackend(`/users/actions/getUserAndSystemInfo`),
		method: "GET",
		...authorizationOptions,
	};
}, true);

export { getUserInfoAPIRequest }; 