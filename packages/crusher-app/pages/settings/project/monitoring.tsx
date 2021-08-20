import React from "react";
import { usePageTitle } from "../../../src/hooks/seo";
import { ProjectSettings } from "@ui/containers/settings/ProjectPage";
import { Monitoring } from '@ui/containers/settings/project/Monitoring';

function Dashboard() {
	usePageTitle("Dashboard");

	return (
		<>
			<Monitoring />
		</>
	);
}

export default Dashboard;
