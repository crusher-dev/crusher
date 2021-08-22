import React from "react";

import { ProjectSettings } from "@ui/containers/settings/ProjectPage";
import { Monitoring } from "@ui/containers/settings/project/Monitoring";

import { usePageTitle } from "../../../src/hooks/seo";

function Dashboard() {
	usePageTitle("Dashboard");

	return (
		<>
			<Monitoring />
		</>
	);
}

export default Dashboard;
