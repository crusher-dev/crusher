import * as path from "path";
import fileUrl from "file-url";
import { IDeepLinkAction } from "./types";
import { createAuthorizedRequestFunc, resolveToBackend } from "./utils/url";
import axios, { AxiosRequestConfig } from "axios";
import { getStore } from "./store/configureStore";
import { getCurrentSelectedProjct } from "./store/selectors/app";

const isProduction = () => {
	return process.env.NODE_ENV === "production";
};

function getAppIconPath() {
	switch (process.platform) {
		case "win32":
			return path.join(__dirname, "static/assets/icons/app.ico");
		default:
			return path.join(__dirname, "static/assets/icons/app.png");
	}
}

function isDevelopment() {
	return process.env.NODE_ENV === "development"
}

export function getAppURl() {
	if (isDevelopment) {
		return "http://localhost:8080"
	}
	return encodePathAsUrl(__dirname, "index.html")
}

function encodePathAsUrl(...pathSegments: string[]): string {
	const Path = path.resolve(...pathSegments);
	return fileUrl(Path);
}

const addHttpToURLIfNotThere = (uri: string) => {
	if (!uri.startsWith("http://") && !uri.startsWith("https://")) {
		return `http://${uri}`;
	}
	return uri;
};

const parseDeepLinkUrlAction = (url: string): IDeepLinkAction | null => {
	const urlObject = new URL(url);
	if (urlObject.protocol === "crusher:") {
		const commandName = urlObject.host;
		const args = Object.fromEntries(urlObject.searchParams as any);

		return { commandName: commandName, args: args };
	}

	return null;
};

function sleep(time: number) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, time);
	});
}

function isValidHttpUrl(str: string) {
	// For local mock server when running tests
	if (str.startsWith("http://localhost") || str.startsWith("https://localhost")) return true;

	const pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
		"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
		"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
		"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
		"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
		"(\\#[-a-z\\d_]*)?$",
		"i",
	); // fragment locator
	return !!pattern.test(str);
}


const getUserInfoFromToken = async (token: string) => {
	// call axios request with token as cookie header
	const infoResponse = await axios.get(resolveToBackend("/users/actions/getUserAndSystemInfo"), {
		headers: {
			Cookie: `isLoggedIn=true; token=${token}`,
		},
		withCredentials: true,
	});

	const info = infoResponse.data;
	if (!info.isUserLoggedIn) throw new Error("Invalid user authentication.");

	return {
		id: info.userData.userId,
		teamName: info.team.name,
		name: info.userData.name,
		email: info.userData.email,
		token: token,
	};
};

const getSelectedProjectTestsRequest: () => AxiosRequestConfig = createAuthorizedRequestFunc((authorizationOptions: any) => {
	const store = getStore();
	const selectedProject = getCurrentSelectedProjct(store.getState() as any);
	if (!selectedProject) return null;

	return {
		url: resolveToBackend(`/projects/${selectedProject}/tests`),
		method: "GET",
		...authorizationOptions,
	};
}, true);

const getSelectedProjectTests: () => Promise<any> = createAuthorizedRequestFunc(async () => {
	let axiosRequest = getSelectedProjectTestsRequest();
	if (!axiosRequest) throw new Error("No project selected");

	return axios(axiosRequest).then((res) => res.data);
});

const getUserAccountProjects: () => Promise<any> = createAuthorizedRequestFunc((authorizationOptions: any) => {
	return axios.get(resolveToBackend("/users/actions/getUserAndSystemInfo"), authorizationOptions).then((res) => res.data);
});

export {
	isProduction,
	getAppIconPath,
	encodePathAsUrl,
	addHttpToURLIfNotThere,
	parseDeepLinkUrlAction,
	sleep,
	isValidHttpUrl,
	getUserInfoFromToken,
	getUserAccountProjects,
	getSelectedProjectTests,
	getSelectedProjectTestsRequest
};
