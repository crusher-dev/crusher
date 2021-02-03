export const ENVIRONMENT = {
	production: "PROD",
	stage: "stage",
	development: "development",
};

export const currentEnvironmentName = ENVIRONMENT[process.env.NODE_ENV];
