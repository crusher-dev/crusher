import * as path from "path";

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

export { isProduction, getAppIconPath };