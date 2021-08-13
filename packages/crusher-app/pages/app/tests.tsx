import React from "react";
import { Suspense } from "react";
import { SidebarTopBarLayout } from "@ui/layout/DashboardBase";
import { TestSearchableList } from "@ui/containers/tests/testList";
import { usePageTitle } from "../../src/hooks/seo";

function Tests() {
	usePageTitle("Tests");
	return (
		<SidebarTopBarLayout>
			<div className="pt-42 pb-24">
				<Suspense fallback={<div>loading...</div>}>
					<TestSearchableList />
				</Suspense>
			</div>
		</SidebarTopBarLayout>
	);
}

export default Tests;
