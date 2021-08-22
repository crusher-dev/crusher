import React from "react";

import { OrgProjects } from "@ui/containers/settings/org/Projects";

import { usePageTitle } from "../../../src/hooks/seo";

function Dashboard() {
	usePageTitle("Dashboard");

	return (
		<>
			<OrgProjects />
		</>
	);
}

export default Dashboard;
