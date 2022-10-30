import React from "react";

import NewProject from "@ui/containers/auth/newProject";

import { usePageTitle } from "../src/hooks/seo";

function Dashboard() {
	usePageTitle("New project");
	return <NewProject />;
}

export default Dashboard;
