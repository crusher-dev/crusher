import React from "react";
import { usePageTitle } from "../../../src/hooks/seo";
import { ProjectSettings } from "@ui/containers/settings/ProjectPage";
import { TeamMembers } from '@ui/containers/settings/org/Team';

function Dashboard() {
	usePageTitle("Dashboard");

	return (
		<>
			<TeamMembers />
		</>
	);
}

export default Dashboard;
