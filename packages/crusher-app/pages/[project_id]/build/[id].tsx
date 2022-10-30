import React from "react";
import { Suspense } from "react";

import { TestReportScreen } from "@ui/containers/testReport/testReportScreen";
import { SidebarTopBarLayout } from "@ui/layout/DashboardBase";
import { LoadingComponent } from "@components/common/loadingComponent";
import { css } from "@emotion/react"

function App() {
	return (
		<SidebarTopBarLayout noContainerWidth={true} hideSidebar={true}>

			<Suspense fallback={<LoadingComponent css={loadintTopCSS} />}>
				<TestReportScreen />
			</Suspense>
		</SidebarTopBarLayout>
	);
}

const loadintTopCSS = css`
top: 20rem;
`
export default App;
