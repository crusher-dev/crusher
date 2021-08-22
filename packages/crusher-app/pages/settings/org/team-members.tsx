import React from "react";

import { ProjectSettings } from "@ui/containers/settings/ProjectPage";
import { TeamMembers } from "@ui/containers/settings/org/Team";

import { usePageTitle } from "../../../src/hooks/seo";

function Dashboard() {
	usePageTitle("Dashboard");

	return (
		<>
			<TeamMembers />
		</>
	);
}

export default Dashboard;
