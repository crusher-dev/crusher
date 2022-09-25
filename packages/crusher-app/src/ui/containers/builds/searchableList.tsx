import { css } from "@emotion/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useMemo, useCallback } from "react";

import { useAtom } from "jotai";
import useSWR from "swr";

import { PaginationButton } from "../../../../../dyson/src/components/molecules/PaginationButton";
import { Conditional } from "dyson/src/components/layouts";

import { ConditionalLink } from "@components/common/ConditionalLink";
import { getBuildsList } from "@constants/api";
import { IProjectBuildListItem, IProjectBuildListResponse } from "@crusher-shared/types/response/iProjectBuildListResponse";
import { ClockIconSVG, CommentIconSVG, DangerIconSVG } from "@svg/builds";
import { TestStatusSVG } from "@svg/testReport";
import { getStringFromDuration, timeSince } from "@utils/common/dateTimeUtils";

import { currentProject } from "../../../store/atoms/global/project";
import { buildFiltersAtom } from "../../../store/atoms/pages/buildPage";
import { SearchFilterBar } from "../common/searchFilterBar";

const EmptyList = dynamic(() => import("@ui/components/common/EmptyList"));
import { useProjectDetails } from "@hooks/common";

interface IBuildItemCardProps {
	info: IProjectBuildListItem;
}

function BuildItemCard(props: IBuildItemCardProps) {
	const { info }: { info: IProjectBuildListItem } = props;
	const { currentProject } = useProjectDetails()

	const { id, createdAt, tests, status, reviewMessage, commentCount, triggeredBy, duration } = info;

	const statusIcon = <TestStatusSVG type={status} height={"16rem"} />;
	const isRunning = !["FAILED", "PASSED", "MANUAL_REVIEW_REQUIRED"].includes(info.status);

	return (
		<ConditionalLink href={`/${currentProject.id}/build/${id}`} disabled={isRunning}>
			<div css={itemContainerStyle} className={"relative"} style={{ cursor: isRunning ? "not-allowed" : "default" }}>
				<div className={"flex flex-row items-center"}>
					<div className={"flex flex-row items-center"}>
						<span css={itemBuildStyle} className={"font-cera font-600"}>
							#{id}
						</span>
						<span className={"ml-18 text-14"}>{tests.totalCount} tests</span>
						<div className={"flex flex-row items-center ml-21"}>
							<ClockIconSVG />
							<span className={"ml-9 text-14"}>{getStringFromDuration(duration)}</span>
						</div>
					</div>

					<div className={"flex flex-row items-center ml-auto"}>
						<div className={"flex flex-row items-center"}>
							<CommentIconSVG />
							<span css={noCommentsStyle} className={"ml-7 text-14"}>
								{commentCount}
							</span>
						</div>
						<span className={"ml-18"}>{statusIcon}</span>
					</div>
				</div>

				<div className={"mt-14 text-13"}>
					<span className={"text-13"}>{timeSince(new Date(createdAt))}</span>
					<span className={"text-13 ml-23 capitalize"}>{status}</span>
					<span className={"text-13 ml-28"}>by - {triggeredBy.name}</span>
				</div>
				<Conditional showIf={reviewMessage?.message.length > 1}>
					<div className={"flex flex-row items-center mt-17"}>
						<DangerIconSVG width={"17rem"} height={"17rem"} />
						<span className={"pt-1 text-13 ml-13"}>{reviewMessage?.message}</span>
					</div>
				</Conditional>
			</div>
		</ConditionalLink>
	);
}

const itemContainerStyle = css`
	background: rgba(16, 18, 21, 0.5);
	border: 1px solid #171c24;
	border-radius: 4rem;
	padding: 20rem 24rem;
	color: rgba(255, 255, 255, 0.6);

	:hover {
		background: rgba(16, 18, 21, 1);
	}
	&:not(:first-child) {
		margin-top: 24rem;
	}
`;
const itemBuildStyle = css`
	color: rgba(255, 255, 255, 0.8) !important;
`;
const noCommentsStyle = css`
	color: #d0d0d0;
`;

function BuildSearchableList() {

	const { currentProject: project } = useProjectDetails()
	const { query } = useRouter();
	const [filters, setFilters] = useAtom(buildFiltersAtom);
	const { data } = useSWR<IProjectBuildListResponse>(getBuildsList(project.id, query.trigger, filters), { suspense: true, refreshInterval: 10000 });
	const { totalPages } = data;

	const { status, triggeredBy, search, page } = filters;
	const isFilterEnabled = !!status || !!triggeredBy || !!search || !!page;
	const currentPage = filters.page || 0;

	const isZeroBuild = data && data.list.length === 0;

	const buildItems = useMemo(() => {
		return data.list.map((buildInfo: IProjectBuildListItem) => {
			return <BuildItemCard info={buildInfo} />;
		});
	}, [data]);

	const setPage = useCallback(
		(page) => {
			setFilters({ ...filters, page });
		},
		[filters],
	);

	const hasNoBuildsOverall = isZeroBuild && !isFilterEnabled;
	return (
		<React.Fragment>
			<Conditional showIf={!hasNoBuildsOverall}>
				<SearchFilterBar data={data} placeholder={"Search builds"} />
			</Conditional>

			<Conditional showIf={!isZeroBuild}>
				<div className={"mt-34"}>{buildItems}</div>
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
