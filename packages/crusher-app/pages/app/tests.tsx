import React from "react";
import { SidebarTopBarLayout } from '@ui/layout/DashboardBase';
import { TestSearchableList } from "@ui/containers/tests/searchableList";

function Tests() {
	return (
		<SidebarTopBarLayout>
            <div className="pl-48 pt-42 pr-48 pb-24">
                <TestSearchableList/>
            </div>
		</SidebarTopBarLayout>
	);
};

export default Tests;
