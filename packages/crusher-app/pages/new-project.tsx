import React from "react";

import { usePageTitle } from "../src/hooks/seo";
import NewProject from "@ui/containers/auth/newProject";
function Dashboard() {
	usePageTitle("New project");
	return <NewProject />;
}


export default Dashboard;
