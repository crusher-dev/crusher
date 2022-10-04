function getLocationOrigin() {
	return eval("window.location.origin");
}

export const resolvePathToBackendURI = (endpoint: string) => {
	// If someone's using gitpod, then use dynamic host
	const isCrusherBackend = process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL.includes("crusher.dev");
	const isGitpodDevEnv = typeof window !== "undefined" && window.location.origin.includes("gitpod");

	if (!isCrusherBackend && isGitpodDevEnv) {
		const gitPodBackendURL = `${window.location.origin}`.replaceAll("3000", "8000");
		return getPathWithHost(gitPodBackendURL, endpoint);
	}

	return getPathWithHost(process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL || `https://backend.crusher.dev`, endpoint);
};

export const resolvePathToFrontendURI = (endpoint: string) => getPathWithHost(getLocationOrigin(), endpoint);

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
