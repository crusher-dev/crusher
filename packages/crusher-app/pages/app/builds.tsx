import React from "react";
import { SidebarTopBarLayout } from '@ui/layout/DashboardBase';
import { BuildSearchableList } from "@ui/containers/builds/searchableList";

function Builds() {
	return (
		<SidebarTopBarLayout>
            <div className="pt-42 pb-24">
                <BuildSearchableList/>
            </div>
		</SidebarTopBarLayout>
	);
};

export default Builds;
