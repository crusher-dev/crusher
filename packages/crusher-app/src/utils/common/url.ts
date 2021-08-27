import { isBrowser } from "@utils/common";

export const resolvePathToBackendURI = (endpoint: string) =>
	getPathWithHost(
		process.env.NEXT_PUBLIC_BACKEND_SERVER_URL || isBrowser ? `${window.location.origin}/server` : process.env.NEXT_INTERNAL_BACKEND_URL || "",
		endpoint,
	);
export const resolvePathToFrontendURI = (endpoint: string) => getPathWithHost(isBrowser ? window.location.origin : "", endpoint);

const getPathWithHost = (host: string, path: string): string => {
	const isBackslashPresent = host.split("")[host.length - 1] === "/";
	const hostName = isBackslashPresent ? host.slice(0, -1) : host;

	return hostName + path;
};

export function appendParamsToURI(url: string, params: { [paramKey: string]: string } = {}) {
	const currentURL = new URL(url);
	for (const paramKey of Object.keys(params)) {
		currentURL.searchParams.append(paramKey, params[paramKey]);
	}

	return currentURL.href;
}

export function addQueryParamToPath(uri: string, params: string) {
	return params ? `${uri}?${params}` : String(uri);
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
