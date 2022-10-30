import React, { useEffect } from "react";
import { Suspense } from "react";

import { useAtom } from "jotai";

import { BuildSearchableList } from "@ui/containers/builds/searchableList";
import { SidebarTopBarLayout } from "@ui/layout/DashboardBase";

import { usePageTitle } from "../../src/hooks/seo";
import { buildFiltersAtom } from "../../src/store/atoms/pages/buildPage";
import { LoadingComponent } from "@components/common/loadingComponent";

function Builds() {
	usePageTitle("Builds");
	const [, setBuildsFilter] = useAtom(buildFiltersAtom);

	useEffect(() => {
		return () => {
			setBuildsFilter({});
		};
	}, []);

	return (
		<SidebarTopBarLayout>
			<div className="pt-20 pb-24">
				<Suspense fallback={<LoadingComponent />}>
					<BuildSearchableList />
				</Suspense>
			</div>
		</SidebarTopBarLayout>
	);
}

export default Builds;
