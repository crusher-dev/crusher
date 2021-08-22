import React from "react";

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
