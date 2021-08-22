import React from "react";

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
