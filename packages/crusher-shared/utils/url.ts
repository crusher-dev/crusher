import parse from "url-parse";

const url = require("url");

function isClient() {
	return eval('typeof window !== "undefined"');
}

function relativeURLToWindow(relativeURL: string) {
	const currentURL = new URL(window.location.href);
	return url.resolve(currentURL, relativeURL);
}

const EXPOSED_FRONTEND_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const FRONTEND_URL = process.env.FRONTEND_URL ? process.env.FRONTEND_URL : "";

const LOCAL_BACKEND_URL = process.env.BACKEND_URL
	? process.env.BACKEND_URL
	: isClient()
	? relativeURLToWindow("/server/")
	: `http://localhost:${EXPOSED_FRONTEND_PORT}/server/`;

const clean = (url: string) => String(url).replace(/^\/|\/$/g, "");

export const isLocal = (url: string) => String(url).startsWith("chrome://") || String(url).startsWith("chrome-extension://");

export const isOfCrusherExtension = (url: string) => Boolean(url) && clean(url).startsWith(clean(chrome.runtime.getURL("/")));

export const origins = (url: string) => {
	const { hostname } = parse(url);
	return [`https://${hostname}`, `http://${hostname}`];
};

export const addHttpToURLIfNotThere = (uri: string) => {
	if (!uri.startsWith("http://") && !uri.startsWith("https://")) {
		return `https://${uri}`;
	}
	return uri;
};

export const getQueryStringParams = function getParameterByName(name: string, url: string) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
	const results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return "";
	return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export const resolveToBackendPath = (relativePath: string, customBasePath: string | null = null) => {
	const basePath = customBasePath ? customBasePath : LOCAL_BACKEND_URL;
	return url.resolve(basePath, relativePath);
};

export const resolveToFrontEndPath = (relativePath: string, customBasePath: string | null = null) => {
	const backendURL = new URL(customBasePath ? customBasePath : FRONTEND_URL);
	return url.resolve(backendURL.origin, relativePath);
};

export function checkValidURL(str: string) {
	const pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
			"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
			"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
			"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
			"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
			"(\\#[-a-z\\d_]*)?$",
		"i",
	); // fragment locator

	const localHostRegex = new RegExp("(localhost|127.0.0.1)(:\\d*)?");
	return !!pattern.test(str) || !!localHostRegex.test(str);
}
