import React from "react";
import { Suspense } from "react";

import { TestSearchableList } from "@ui/containers/tests/testList";
import { SidebarTopBarLayout } from "@ui/layout/DashboardBase";

import { usePageTitle } from "../../src/hooks/seo";

function Tests() {
	usePageTitle("Tests");
	return (
		<SidebarTopBarLayout setContainerWidth={false}>
			<div className="pt-32 pb-24">
				<Suspense fallback={<div>loading...</div>}>
					<TestSearchableList />
				</Suspense>
			</div>
		</SidebarTopBarLayout>
	);
}

export default Tests;
