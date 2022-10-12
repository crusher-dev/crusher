import { css } from "@emotion/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useMemo, useCallback } from "react";

import { useAtom } from "jotai";
import useSWR from "swr";

import { PaginationButton } from "../../../../../dyson/src/components/molecules/PaginationButton";
import { Conditional } from "dyson/src/components/layouts";

import { getBuildsList } from "@constants/api";
import { IProjectBuildListItem, IProjectBuildListResponse } from "@crusher-shared/types/response/iProjectBuildListResponse";
import { useProjectDetails } from "@hooks/common";

import { buildFiltersAtom } from "../../../store/atoms/pages/buildPage";
import { BuildsList } from "dyson/src/components/sharedComponets/buildsList/index";
import { BuildListContext } from "dyson/src/components/sharedComponets/utils/basic";

const EmptyList = dynamic(() => import("@ui/components/common/EmptyList"));


function BuildSearchableList() {
	const { currentProject: project } = useProjectDetails();
	const { query } = useRouter();
	const [filters, setFilters] = useAtom(buildFiltersAtom);
	const { data } = useSWR<IProjectBuildListResponse>(getBuildsList(project.id, query.trigger, filters), { suspense: true, refreshInterval: 10000 });
	const { totalPages } = data;
	const { currentProject } = useProjectDetails();

	const router = useRouter();

	const { status, triggeredBy, search, page } = filters;
	const isFilterEnabled = !!status || !!triggeredBy || !!search || !!page;
	const currentPage = filters.page || 0;

	const isZeroBuild = data && data.list.length === 0;

	const setPage = useCallback(
		(page) => {
			setFilters({ ...filters, page });
		},
		[filters],
	);

	const handleViewTest = (buildId) => {
		router.push(`/${currentProject.id}/build/${buildId}`);
	};

	const handleShowLocalBuild = () => {

	};

	const handleShowMine = () => {

	};

	const hasNoBuildsOverall = isZeroBuild && !isFilterEnabled;
	return (
		<React.Fragment>

			<Conditional showIf={!isZeroBuild}>
				<BuildListContext.Provider value={{
					showLocalBuildCallback: handleShowLocalBuild,
					showMineCallback: handleShowMine,
				}}>
					<div>
						<BuildsList viewTestCallback={handleViewTest} builds={data.list as any} />
					</div>
				</BuildListContext.Provider>
			</Conditional>

			<Conditional showIf={hasNoBuildsOverall}>
				<EmptyList title={"You don’t have any build right now."} subTitle={"Once ran, builds will pop here."} />
			</Conditional>

			<Conditional showIf={isZeroBuild && isFilterEnabled}>
				<EmptyList title={"No builds yet."} subTitle={"Your selection doesn't have any results."} />
			</Conditional>

			<Conditional showIf={!isZeroBuild}>
				<div className={"flex justify-center mt-64 mb-80"}>
					<PaginationButton
						isPreviousActive={currentPage > 0}
						isNextActive={currentPage < totalPages - 1}
						onPreviousClick={setPage.bind(this, currentPage - 1)}
						onNextClick={setPage.bind(this, currentPage + 1)}
					/>
				</div>
			</Conditional>
		</React.Fragment>
	);
}

export { BuildSearchableList };
