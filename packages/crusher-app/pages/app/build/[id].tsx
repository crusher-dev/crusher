import React from "react";
import { SidebarTopBarLayout } from "@ui/layout/DashboardBase";
import { TestReport } from "@ui/containers/testReport/testReport";
import { Suspense } from "react";
function App() {
	return (
		<SidebarTopBarLayout hideSidebar={true}>
			<Suspense fallback={<div>loading...</div>}>
				<TestReport />
			</Suspense>
		</SidebarTopBarLayout>
	);
}

export default App;
