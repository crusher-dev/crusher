import React from "react";
import { usePageTitle } from "../../../src/hooks/seo";
import { ProjectSettings } from "@ui/containers/settings/ProjectPage";
import { Environment } from '@ui/containers/settings/project/Environment';

function Dashboard() {
	usePageTitle("Dashboard");

	return (
		<>
			<Environment />
		</>
	);
}

export default Dashboard;
