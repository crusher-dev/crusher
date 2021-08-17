import React from "react";
import { SidebarTopBarLayout } from "@ui/layout/DashboardBase";
import { TestReportScreen } from "@ui/containers/testReport/testReportScreen";
import { Suspense } from "react";
function App() {
	return (
		<SidebarTopBarLayout hideSidebar={true}>
			<Suspense fallback={<div>loading...</div>}>
				<TestReportScreen />
			</Suspense>
		</SidebarTopBarLayout>
	);
}

export default App;
