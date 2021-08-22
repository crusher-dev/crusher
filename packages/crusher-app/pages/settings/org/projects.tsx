import React from "react";

import { ProjectSettings } from "@ui/containers/settings/ProjectPage";
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
