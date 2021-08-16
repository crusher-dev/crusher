import React, { ChangeEvent, useState, useMemo, useCallback } from "react";
import { Conditional } from "dyson/src/components/layouts";
import { CompleteStatusIconSVG } from "@svg/dashboard";
import { ClockIconSVG, CommentIconSVG, DangerIconSVG, DropdownIconSVG } from "@svg/builds";
import { css } from "@emotion/react";
import { SearchFilterBar } from "../common/searchFilterBar";
import Link from "next/link";
import useSWR from "swr";
import { getBuildsList } from "@constants/api";
import { useAtom } from "jotai";
import { currentProject } from "../../../store/atoms/global/project";
import { IProjectBuildListItem, IProjectBuildListResponse } from "@crusher-shared/types/response/iProjectBuildListResponse";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { TestStatusSVG } from "@svg/testReport";
import { showReviewButton } from "@utils/pages/buildReportUtils";
import { timeSince } from "@utils/dateTimeUtils";
import { PaginationButton } from "../../../../../dyson/src/components/molecules/PaginationButton";
import { buildFiltersAtom } from "../../../store/atoms/pages/buildPage";

const EmptyList = dynamic(() => import("@ui/components/common/EmptyList"));

interface IBuildItemCardProps {
	info: IProjectBuildListItem;
}

function BuildItemCard(props: IBuildItemCardProps) {
	const { info }: { info: IProjectBuildListItem } = props;

	const { id, createdAt, tests, status, reviewMessage, commentCount, triggeredBy, duration } = info;

	const statusIcon = <TestStatusSVG type={status} height={16} />;

	return (
		<Link href={`/app/build/${id}`}>
			<div css={itemContainerStyle} className={"relative"}>
				<div className={"flex flex-row items-center"}>
					<div className={"flex flex-row items-center"}>
						<span css={itemBuildStyle} className={"font-cera font-600"}>
							#{id}
						</span>
						<span className={"ml-18 text-14"}>{tests.totalCount} tests</span>
						<div className={"flex flex-row items-center ml-21"}>
							<ClockIconSVG />
							<span className={"ml-9 text-14"}>{duration} mins</span>
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
						<DangerIconSVG width={17} height={17} />
						<span className={"pt-1 text-13 ml-13"}>{reviewMessage?.message}</span>
					</div>
				</Conditional>
			</div>
		</Link>
	);
}

const itemContainerStyle = css`
	background: rgba(16, 18, 21, 0.5);
	border: 1px solid #171c24;
	border-radius: 8rem;
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
	const [project] = useAtom(currentProject);
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
			return (
				<Link href={`/app/build/${buildInfo.id}`}>
					<BuildItemCard info={buildInfo} />
				</Link>
			);
		});
	}, [data]);

	const setPage = useCallback((page) => {
		setFilters({ ...filters, page });
	}, []);

	const hasNoBuildsOverall = isZeroBuild && !isFilterEnabled;

	return (
		<div>
			<Conditional showIf={!hasNoBuildsOverall}>
				<SearchFilterBar data={data} placeholder={"Search builds"}  />
			</Conditional>

			<Conditional showIf={!isZeroBuild}>
				<div className={"mt-34"}>{buildItems}</div>
			</Conditional>

			<Conditional showIf={hasNoBuildsOverall}>
				<EmptyList title={"You don’t have any build right now."} subTitle={"Once ran, builds will pop here."} />
			</Conditional>

			<Conditional showIf={isZeroBuild && isFilterEnabled }>
				<EmptyList title={"No builds yet."} subTitle={"Your selection doesn't have any results."} />
			</Conditional>

			<Conditional showIf={!isZeroBuild}>
				<div className={"flex justify-center mt-64 mb-80"}>
					<PaginationButton
						isPreviousActive={currentPage > 1}
						isNextActive={currentPage < totalPages}
						onPreviousClick={setPage.bind(this, currentPage - 1)}
						onNextClick={setPage.bind(this, currentPage + 1)}
					/>
				</div>
			</Conditional>
		</div>
	);
}

export { BuildSearchableList };
