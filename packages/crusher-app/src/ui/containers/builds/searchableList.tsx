import React, { ChangeEvent, useState, useMemo } from "react";
import { Conditional } from "dyson/src/components/layouts";
import { CompleteStatusIconSVG } from "@svg/dashboard";
import { ClockIconSVG, CommentIconSVG, DangerIconSVG, DropdownIconSVG } from "@svg/builds";
import { css } from "@emotion/core";
import { SearchFilterBar } from "../common/searchFilterBar";
import Link from "next/link";
import useSWR from "swr";
import { BUILD_LIST_API, TEST_LIST_API } from "@constants/api";

interface IBuildItemCardProps {
	buildId: string;
	noTests: number;
	// In seconds
	buildTimeTaken: number;
	createdAt: Date;
	status: "Running" | "Review Required" | "Passed" | "Failed" | "Timeout";
	// user name
	triggeredBy: string;
	noComments: number;
	hasPassed: boolean;
	shouldShowProductionWarning: boolean;
}

function BuildItemCard(props: IBuildItemCardProps) {
	const { info } = props;
	console.log(info, props);

	const { id, name, createdAt, tests, status, reviewMessage, commentCount, startedBy, duration } = info;

	// return null
	// // const { buildId, status, buildTimeTaken, triggeredBy, noTests, noComments, hasPassed, shouldShowProductionWarning } = props;

	const statusIcon = status === "passed" ? <CompleteStatusIconSVG isCompleted={true} /> : <CompleteStatusIconSVG isCompleted={false} />;

	return (
		<Link href={`/app/build/${id}`}>
			<div css={itemContainerStyle} className={"relative"}>
				<div className={"flex flex-row items-center"}>
					<div className={"flex flex-row items-center"}>
						<span css={itemBuildStyle} className={"font-cera"}>
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
					<span className={"text-13"}>{createdAt}</span>
					<span className={"text-13 ml-23 capitalize"}>{status}</span>
					<span className={"text-13 ml-28"}>by - {startedBy}</span>
				</div>
				<Conditional showIf={reviewMessage.message.length > 1}>
					<div className={"flex flex-row items-center mt-17"}>
						<DangerIconSVG width={17} height={17} />
						<span className={"pt-1 text-13 ml-13"}>{reviewMessage.message}</span>
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
const DUMMY_BUILDS_LIST = require("./dummyBuilds.json");

function BuildSearchableList() {
	const [buildsList, _] = useState(DUMMY_BUILDS_LIST);
	const [searchQuery, setSearchQuery] = useState(null as null | string);
	const { data } = useSWR(BUILD_LIST_API, { suspense: true });

	console.log(data);

	const buildItems = useMemo(() => {
		return data.map((buildInfo: any) => {
			return (
				<Link href={`/app/build/${buildInfo.id}`}>
					<BuildItemCard info={buildInfo} />
				</Link>
			);
		});
	}, [searchQuery]);

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	return (
		<div>
			<SearchFilterBar placeholder={"Search builds"} handleInputChange={handleInputChange} value={searchQuery} />
			<div className={"mt-34"}>{buildItems}</div>
		</div>
	);
}

export { BuildSearchableList };
