const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";

if (IS_DEVELOPMENT) {
	process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
}

export const BACKEND_SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend.crusher-test.com/";
export const FRONTEND_SERVER_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://www.crusher-test.com/";

export const TEST_TYPES = {
	DRAFT: "DRAFT",
	SAVED: "SAVED",
};

export const PROJECT_MENU_ITEMS = {
	HOSTS: "Hosts",
	MONITORING: "Monitoring",
	ALERTING: "Alerting / Integration",
};

export const TEAM_SETTING_MENU_ITEMS = {
	OVERVIEW: "Overview",
	PROJECTS: "Projects",
	BILLING: "Billing",
	TEAM: "Team",
};

export const PIXEL_REM_RATIO = 16;
