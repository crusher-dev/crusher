import React from "react";
import { SidebarTopBarLayout } from '@ui/layout/DashboardBase';
import { BuildSearchableList } from "@ui/containers/builds/searchableList";

function Builds() {
	return (
		<SidebarTopBarLayout>
            <div className="pl-48 pt-42 pr-48 pb-24">
                <BuildSearchableList/>
            </div>
		</SidebarTopBarLayout>
	);
};

export default Builds;
