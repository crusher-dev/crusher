import * as path from "path";
import fileUrl from "file-url";
import { IDeepLinkAction } from "./types";
import { resolveToBackendPath, resolveToFrontEndPath } from "@shared/utils/url";

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

const waitForUserLogin = async (callback?, customBackendPath: string | undefined = undefined): Promise<{ loginKey: string, interval }> => {
	const axios = require("axios").default;
	const loginKey = await axios.get(resolveToBackendPath("/cli/get.key", customBackendPath)).then((res) => {
		return res.data.loginKey;
	});

	const interval = setInterval(async () => {
		const loginKeyStatus = await axios.get(resolveToBackendPath(`/cli/status.key?loginKey=${loginKey}`, customBackendPath)).then((res) => res.data);
		if (loginKeyStatus.status === "Validated") {
			clearInterval(interval);
			if (callback) {
				callback(loginKeyStatus.userToken);
			}
		}
	}, 5000);

	return { loginKey: loginKey, interval };
};

const getUserInfoFromToken = async (token: string, customBackendPath: string | undefined = undefined) => {
	const axios = require("axios").default;
	// call axios request with token as cookie header
	const infoResponse = await axios.get(resolveToBackendPath("/users/actions/getUserAndSystemInfo", customBackendPath), {
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

const getUserAccountTests = async (projectId: string | null, token: string, customBackendPath: string | undefined = undefined) => {
	const axios = require("axios").default;
	// call axios request with token as cookie header
	const infoResponse = await axios.get(resolveToBackendPath(`/projects/${projectId}/tests/`, customBackendPath), {
		headers: {
			Cookie: `isLoggedIn=true; token=${token}`,
		},
		withCredentials: true,
	});

	return infoResponse.data;
};

const getUserAccountProjects = async (token: string, customBackendPath: string | undefined = undefined) => {
	const axios = require("axios").default;
	// call axios request with token as cookie header
	const infoResponse = await axios.get(resolveToBackendPath("/users/actions/getUserAndSystemInfo", customBackendPath), {
		headers: {
			Cookie: `isLoggedIn=true; token=${token}`,
		},
		withCredentials: true,
	});

	return infoResponse.data;
};

export { isProduction, getAppIconPath, encodePathAsUrl, addHttpToURLIfNotThere, parseDeepLinkUrlAction, sleep, isValidHttpUrl, waitForUserLogin, getUserInfoFromToken, getUserAccountTests, getUserAccountProjects };
