import * as path from "path";
import fileUrl from 'file-url'

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

export { isProduction, getAppIconPath, encodePathAsUrl, addHttpToURLIfNotThere };