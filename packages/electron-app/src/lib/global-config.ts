import * as fs from "fs";
import * as path from "path";

function getRuntimeEnv() {
	return eval("process.env");
}

export const APP_DIRECTORY = `/${getRuntimeEnv().HOME}/.crusher`;

const resolvePathToAppDirectory = (relativePath): string => {
	return path.resolve(APP_DIRECTORY, relativePath);
};

const CRUSHER_CONFIG_FILE = resolvePathToAppDirectory("crusher.json");

export const initializeGlobalAppConfig = () => {
	if (!fs.existsSync(APP_DIRECTORY)) {
		fs.mkdirSync(APP_DIRECTORY);
		fs.mkdirSync(resolvePathToAppDirectory("bin"));
	}

	if (!fs.existsSync(path.resolve(APP_DIRECTORY, "crusher.json"))) {
		writeGlobalAppConfig({});
	}
};

export const writeGlobalAppConfig = (config) => {
	fs.writeFileSync(CRUSHER_CONFIG_FILE, JSON.stringify(config));
};

export const getGlobalAppConfig = () => {
	if (!isCrusherConfigured()) {
		return initializeGlobalAppConfig();
	}

	return isCrusherConfigured() ? JSON.parse(fs.readFileSync(CRUSHER_CONFIG_FILE, "utf8")) : null;
};

export const isCrusherConfigured = () => {
	return fs.existsSync(CRUSHER_CONFIG_FILE);
};
