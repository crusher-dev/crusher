import * as path from "path";

export const ENVIRONMENT = {
	production: "PROD",
	stage: "stage",
	development: "development",
};

export const currentEnvironmentName = ENVIRONMENT[process.env.NODE_ENV];

export const resoveWorkerPath = (fileName): string => {
	if (process.env.NODE_ENV === "development") return fileName;
	try {
		const workerPath = path.resolve(fileName);
		return workerPath;
	} finally {
		// For resolving in es build, where we don't have access.
		return path.resolve(fileName.replace(".ts", ".ts.js"));
	}
};
