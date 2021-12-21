import * as path from "path";
import fileUrl from 'file-url'

const isProduction = () => {
    return process.env.NODE_ENV === "production";
}

function getAppIconPath() {
	switch (process.platform) {
		case "win32":
			return path.join(__dirname, "assets/icons/app.ico");
		default:
			return path.join(__dirname, "assets/icons/app.png");
	}
}

 function encodePathAsUrl(...pathSegments: string[]): string {
	const Path = path.resolve(...pathSegments)
	return fileUrl(Path)
  }

export { isProduction, getAppIconPath, encodePathAsUrl };