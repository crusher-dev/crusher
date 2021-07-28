import React from "react";
import { SidebarTopBarLayout } from "@ui/layout/DashboardBase";
import { TestReport } from "@ui/containers/testReport/testReport";

function App() {
	return (
		<SidebarTopBarLayout hideSidebar={true}>
			<TestReport />
		</SidebarTopBarLayout>
	);
}

export default App;
