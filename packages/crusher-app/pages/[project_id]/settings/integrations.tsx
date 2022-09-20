import React from "react";

import { usePageTitle } from "../../../src/hooks/seo";
import { Integrations } from "@ui/containers/settings/org/Integrations";

function Dashboard() {
	usePageTitle("Integrations");

	return (
		<>
			<Integrations />
		</>
	);
}

export default Dashboard;
