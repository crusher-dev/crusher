import React from "react";

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
