import React from "react";

import { ProjectSettings } from "@ui/containers/settings/ProjectPage";

import { usePageTitle } from "../../../src/hooks/seo";

function Dashboard() {
	usePageTitle("Dashboard");

	return (
		<>
			<ProjectSettings />
		</>
	);
}

export default Dashboard;
