import {AxiosRequestConfig} from "axios";
import { createAuthorizedRequestFunc, resolveToBackend } from "electron-app/src/utils/url";


const getUserInfoAPIRequest: () => AxiosRequestConfig = createAuthorizedRequestFunc((authorizationOptions: any) => {
	return {
		url: resolveToBackend(`/users/actions/getUserAndSystemInfo`),
		method: "GET",
		...authorizationOptions,
	};
}, true);

export { getUserInfoAPIRequest }; 