import React from "react";

import { Integrations } from "@ui/containers/settings/org/Integrations";

import { usePageTitle } from "../../../src/hooks/seo";

function Dashboard() {
	usePageTitle("Integrations");

	return (
		<>
			<Integrations />
		</>
	);
}

export default Dashboard;
