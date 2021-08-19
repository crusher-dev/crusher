import React from "react";
import { usePageTitle } from "../../src/hooks/seo";
import { ProjectSettings } from "@ui/containers/settings/ProjectPage";

function Dashboard() {
	usePageTitle("Dashboard");

	return (
		<>
			<ProjectSettings />
		</>
	);
}

export default Dashboard;
