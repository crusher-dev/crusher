import React from "react";
import { Suspense } from "react";

import { TestReportScreen } from "@ui/containers/testReport/testReportScreen";
import { SidebarTopBarLayout } from "@ui/layout/DashboardBase";

function App() {
	return (
		<SidebarTopBarLayout noContainerWidth={true} hideSidebar={true}>
			<Suspense fallback={<div>loading...</div>}>
				<TestReportScreen />
			</Suspense>
		</SidebarTopBarLayout>
	);
}

export default App;
