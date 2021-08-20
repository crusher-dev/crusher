import React from "react";
import { usePageTitle } from "../../../src/hooks/seo";
import { ProjectSettings } from "@ui/containers/settings/ProjectPage";
import { OrgProjects } from "@ui/containers/settings/org/Projects";

function Dashboard() {
	usePageTitle("Dashboard");

	return (
		<>
			<OrgProjects />
		</>
	);
}

export default Dashboard;
