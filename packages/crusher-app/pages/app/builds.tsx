import React from "react";
import { SidebarTopBarLayout } from '@ui/layout/DashboardBase';
import { BuildSearchableList } from "@ui/containers/builds/searchableList";
import { usePageTitle } from '../../src/hooks/seo';
import { Suspense } from "react";

function Builds() {
	usePageTitle("Builds");
	return (
		<SidebarTopBarLayout>
            <div className="pt-42 pb-24">
							<Suspense fallback={<div>loading...</div>}>
                <BuildSearchableList/>
							</Suspense>
            </div>
		</SidebarTopBarLayout>
	);
};

export default Builds;
