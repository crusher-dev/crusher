import React, { ChangeEvent, useState, useMemo } from "react";
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
	const [searchQuery, setSearchQuery] = useState(null as null | string);
	const { data } = useSWR<IProjectBuildListResponse>(getBuildsList(project.id, query.trigger), { suspense: true });

	const buildItems = useMemo(() => {
		return data.list.map((buildInfo: IProjectBuildListItem) => {
			return (
				<Link href={`/app/build/${buildInfo.id}`}>
					<BuildItemCard info={buildInfo} />
				</Link>
			);
		});
	}, [searchQuery, data]);

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	return (
		<div>
			<Conditional showIf={data && data.list.length > 0}>
				<SearchFilterBar placeholder={"Search builds"} handleInputChange={handleInputChange} value={searchQuery} />
				<div className={"mt-34"}>{buildItems}</div>
			</Conditional>

			<Conditional showIf={data && data.list.length === 0}>
				<EmptyList title={"You don’t have any build right now."} subTitle={"Once ran, builds will pop here."} />
			</Conditional>
		</div>
	);
}

export { BuildSearchableList };
