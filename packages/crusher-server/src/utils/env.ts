import * as path from "path";

const ENVIRONMENT = {
	production: "PROD",
	stage: "stage",
	development: "development",
};

const currentEnvironmentName = ENVIRONMENT[process.env.NODE_ENV];

const resolveWorkerPath = (relativeFileName: string): string => {
	const absoluteFileName = path.resolve(relativeFileName);
	if (process.env.NODE_ENV === "development") return absoluteFileName;

	return absoluteFileName.replace(".ts", ".ts.js");
};

export { ENVIRONMENT, currentEnvironmentName, resolveWorkerPath };
