import { BACKEND_SERVER_URL, FRONTEND_SERVER_URL } from "@constants/other";

export const resolvePathToBackendURI = (endpoint: string) => resolveURl(BACKEND_SERVER_URL || "/server",endpoint);
export const resolvePathToFrontendURI = (endpoint: string) => resolveURl(FRONTEND_SERVER_URL || "",endpoint);

const resolveURl = (host: string,path: string) : string=>{
	const isBackslashPresent = host.split("")[host.length-1] === "/";
	const hostName = isBackslashPresent ? host.slice(0, host.length-1) : host;

	return  hostName+path
}

export function appendParamsToURI(uri: string, params: { [paramKey: string]: string }) {
    const currentURL = new URL(uri);
    for (const paramKey of Object.keys(params)) {
		currentURL.searchParams.append(paramKey, params[paramKey]);
	}

    return currentURL.href;
}

export function checkIfAbsoluteURI(uri: string) {
	const rgx = /^https?:\/\//i;
	return rgx.test(uri);
}

export function getAbsoluteURIIfRelative(uri: string) {
	const isAbsolute = checkIfAbsoluteURI(uri);
	if (!isAbsolute) {
		uri = resolvePathToBackendURI(uri);
	}
	return uri;
}
