import React from "react";
import { SidebarTopBarBase } from '@ui/layout/DashboardBase';
import { TestReport } from '@ui/containers/testReport/testReport';

function App() {
	return (
		<SidebarTopBarBase hideSidebar={true}>
			<TestReport/>
		</SidebarTopBarBase>
	);
}

export default App;
