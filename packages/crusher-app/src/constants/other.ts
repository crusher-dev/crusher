const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";

if (IS_DEVELOPMENT) {
	process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
}

export const BACKEND_SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_URL ;

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
