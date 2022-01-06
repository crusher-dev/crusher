import * as path from "path";
import fileUrl from 'file-url'
import { IDeepLinkAction } from "./types";

const isProduction = () => {
    return process.env.NODE_ENV === "production";
}

function getAppIconPath() {
	switch (process.platform) {
		case "win32":
			return path.join(__dirname, "static/assets/icons/app.ico");
		default:
			return path.join(__dirname, "static/assets/icons/app.png");
	}
}

function encodePathAsUrl(...pathSegments: string[]): string {
	const Path = path.resolve(...pathSegments)
	return fileUrl(Path)
}

const addHttpToURLIfNotThere = (uri: string) => {
	if (!uri.startsWith("http://") && !uri.startsWith("https://")) {
		return `http://${uri}`;
	}
	return uri;
};

const parseDeepLinkUrlAction = (url: string): IDeepLinkAction | null => {
	const urlObject = new URL(url);
	if(urlObject.protocol === "crusher:") {
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


export { isProduction, getAppIconPath, encodePathAsUrl, addHttpToURLIfNotThere, parseDeepLinkUrlAction, sleep };