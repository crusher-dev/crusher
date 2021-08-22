import React from "react";

import { ProjectSettings } from "@ui/containers/settings/ProjectPage";
import { Environment } from "@ui/containers/settings/project/Environment";

import { usePageTitle } from "../../../src/hooks/seo";

function Dashboard() {
	usePageTitle("Dashboard");

	return (
		<>
			<Environment />
		</>
	);
}

export default Dashboard;
