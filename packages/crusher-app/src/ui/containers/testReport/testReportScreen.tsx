import { css } from "@emotion/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

import { atom, useAtom } from "jotai";

import { Button, Text } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts";


import { CalendarSVG, FailedSVG, InitiatedSVG, PassedSVG, RerunSVG, ReviewRequiredSVG, RunningSVG, TestStatusSVG, ThreeEllipsisSVG, ThunderSVG } from "@svg/testReport";
import { backendRequest } from "@utils/common/backendRequest";
import { timeSince } from "@utils/common/dateTimeUtils";
import { sendSnackBarEvent } from "@utils/common/notify";
import { getAllConfiguration, getStatusString, showReviewButton, getCountByTestStatus } from "@utils/core/buildReportUtils";

import { usePageTitle } from "../../../hooks/seo";
import { useBuildReport } from "../../../store/serverState/buildReports";
import { RequestMethod } from "../../../types/RequestOptions";
import { updateMeta } from "../../../store/mutators/metaData";
import { PROJECT_META_KEYS, USER_META_KEYS } from "@constants/USER";
import { useMemo } from "react";
import { TestTypeLabel } from "@constants/test";
import { ReviewSection } from "./testList";
import { CorrentSVG } from "@svg/builds";
import { GithubSquare, GithubSVG } from "@svg/social";
import { CommentIcon, PlayIcon, PlusCircle, ReloadIcon } from "@svg/dashboard";
import Download from "../dashboard/Download";

const ReportSection = dynamic(() => import("./testList"));
function BuildInfoTop() {
	const router = useRouter();
	const { query } = router;
	const { data } = useBuildReport(query.id);

	const name = "feats: integrated test GTM #517";

	return (
		<div>
			<div className={"font-cera text-18 font-700 leading-none flex pt-8"} id={"title"}>
				{name || `${data?.name} #${data?.id}`} <CorrentSVG height={18} width={18} className="ml-16" />
			</div>
			<div className="flex items-center mt-16" css={flexGap}>
				<div className="flex items-center">
					<Text color="#696969" fontSize={13}>Status : </Text>
					<Text color="#E7E7E7" fontSize={13}>All passed</Text>
				</div>
				<div className="flex items-center">
					<GithubSquare className="mr-8" />
					<Text color="#E7E7E7" fontSize={13}>Github #2132</Text>
				</div>
				<div className="flex items-center">
					<Text color="#696969" fontSize={13}>duration : </Text>
					<Text color="#E7E7E7" fontSize={13}>12s</Text>
				</div>
				<div className="flex items-center">
					<Text color="#696969" fontSize={13}>test count : </Text>
					<Text color="#E7E7E7" fontSize={13}>12</Text>
				</div>
			</div>

		</div>
	);
}


const flexGap = css`
	gap: 28rem;
`


function StatusTag({ type }) {
	if (type === "MANUAL_REVIEW_REQUIRED") {
		return (
			<div className={"flex items-center px-12 justify-center mr-8"} css={[statusTag, review]}>
				<ReviewRequiredSVG height={"17rem"} isMonochrome={true} /> <span className={" text-14 font-600 ml-8 leading-none"}>Review required</span>
			</div>
		);
	}
	if (type === "FAILED") {
		return (
			<div className={"flex items-center px-12 justify-center mr-8"} css={[statusTag, failed]}>
				<FailedSVG height={"16rem"} width={"16rem"} isMonochrome={true} /> <span className={" text-14 font-600 ml-8 leading-none"}>Failed</span>
			</div>
		);
	}
	if (type === "PASSED") {
		return (
			<div className={"flex items-center px-12 justify-center mr-8"} css={[statusTag, passed]}>
				<PassedSVG height={"20rem"} isMonochrome={true} /> <span className={"text-14 mt-1 font-600 ml-8 leading-none"}>Passed</span>
			</div>
		);
	}
	if (type === "RUNNING") {
		return (
			<div className={"flex items-center px-12 justify-center mr-8"} css={[statusTag, running]}>
				<RunningSVG height={"16rem"} isMonochrome={true} /> <span className={" text-14 font-600 ml-8 leading-none"}>Running</span>
			</div>
		);
	}
	return (
		<div className={"flex items-center px-12 justify-center mr-8"} css={[statusTag, waiting]}>
			<InitiatedSVG height={"16rem"} isMonochrome={true} /> <span className={"text-14 font-600 ml-8 leading-none"}>Waiting</span>
		</div>
	);
}

function ReportInfoTOp() {
	const { query } = useRouter();
	const { data } = useBuildReport(query.id);

	const title = data.name || `#${data?.id}`;
	usePageTitle(title);
	return (
		<div className={"flex"}>

			<ImageSection />

			<div className="w-full">
				<div id="build-info-top" className="flex justify-between w-full">
					<BuildInfoTop />
					<BuildInfoButtons />
				</div>
			</div>
		</div>
	);
}



function BuildInfoButtons() {
	return <div className="flex items-center" css={btnGap}>

		<Reload />
		<Review />
		<RunLocally />
	</div>;
}

const btnGap = css`
	gap: 12rem;
`

function Reload() {
	const { query } = useRouter()
	const runProjectTest = useCallback(() => {
		rerunBuild(query.id)
	}, []);

	return (
		<React.Fragment>
			<Button bgColor={"tertiary"} title="Rerun this build" onClick={runProjectTest.bind(this)} css={creatTestCSS}>
				<div className={"flex items-center"}>
					<ReloadIcon />
				</div>
			</Button>
		</React.Fragment>
	);
}

function Review() {
	const [showCreateTest, setShowCreateTest] = useState(false)

	const runProjectTest = useCallback(() => {

	}, []);

	return (
		<React.Fragment>
			<Conditional showIf={showCreateTest}>
				<Download onClose={setShowCreateTest.bind(this, false)} />
			</Conditional>
			<Button title="leave a comment/review" bgColor={"tertiary"} onClick={runProjectTest} css={creatTestCSS}>
				<div className={"flex items-center"}>
					<CommentIcon className={"mr-6"} />
					<span className="mt-1">
						review
					</span>
				</div>
			</Button>
		</React.Fragment>
	);
}

function RunLocally() {
	// const router = useRouter();
	// const { currentProject } = useProjectDetails()
	// const { query } = router;
	// const [filters] = useAtom(buildFiltersAtom);
	// const [, updateMetaData] = useAtom(updateMeta);

	const runProjectTest = useCallback(() => {
		(async () => {
			// await handleTestRun(currentProject?.id, query, filters, router, updateMetaData);

			// updateMetaData({
			// 	type: "user",
			// 	key: USER_META_KEYS.RAN_TEST,
			// 	value: true,
			// });

			// updateMetaData({
			// 	type: "project",
			// 	key: PROJECT_META_KEYS.RAN_TEST,
			// 	value: true,
			// });
		})();
	}, []);

	return (
		<Button bgColor={"tertiary"} title="run test locally" onClick={runProjectTest} css={runTestCSS}>
			<div className={"flex items-center"}>
				<PlayIcon className={"mr-6"} />
				<span className="mt-2">
					run locally
				</span>
			</div>
		</Button>
	);
}

const runTestCSS = css`
	padding: 0 10rem;
	height: 30rpx;

	font-family: 'Gilroy';
font-style: normal;
font-weight: 600;
font-size: 13px;

color: #FFFFFF;

width: max-content;


background: #A742F7;
border: 1px solid #7D41AD;
border-radius: 8px;

:hover{
	background: #A742F7;
	filter: brighntess(.7);
	border: 1px solid #7D41AD;
}
`

const creatTestCSS = css`
padding: 0 10rem;
font-family: 'Gilroy';
font-style: normal;
font-weight: 600;
font-size: 13px;

color: #FFFFFF;

width: max-content;

background: #0D0D0D;
border: 0.5px solid rgba(219, 222, 255, 0.16);
border-radius: 8px;

:hover{
	background: #313131;
	filter: brighntess(.8);
}
`
const section = [
	{
		name: "Home",
		icon: null,
		key: "reports",
	},
	{
		name: "Tests",
		icon: null,
		key: "insights"
	},
	{
		name: "Insights & Alert",
		icon: null,
		key: "insights"
	},
	{
		name: "log",
		icon: null,
	},
];

const selectedTabAtom = atom(0);

export const rerunBuild = async (buildId) => {
	await backendRequest(`/builds/${buildId}/actions/rerun`, {
		method: RequestMethod.POST,
	});

	sendSnackBarEvent({ type: "normal", message: "We've started new build" });
};

function ImageSection() {
	return <div className="mr-46">
		<img src="https://i.imgur.com/GT2hLO9.png" css={previewImgCss} />
	</div>;
}

const previewImgCss = css`
	min-width: 304rem;
    height: 220rem;
    border: 0.5px solid rgb(255 255 255 / 6%);
    border-radius: 15px;
`
function TabBar() {
	const [selectedTabIndex, setSelectedTabIndex] = useAtom(selectedTabAtom);
	return (
		<div css={Tab} className={"flex mt-88	 "}>
			{section.map(({ name, icon, key }, i) => (
				<div onClick={setSelectedTabIndex.bind(this, i)} key={key}>
					<div css={[TabItem, selectedTabIndex === i && selected]} className={`flex items-center justify-center text-14`}>
						<Conditional showIf={icon}>
							<span className={"mr-8"}>{icon}</span>
						</Conditional>
						{name}
					</div>
				</div>
			))}
			<div css={css`margin-left: auto;`}>
				<ReviewSection />
			</div>
		</div>
	);
}

function ConfigurationMethod({ configType, array }) {
	return (
		<div className={"text-13 mb-16"}>
			<span className={"text-13 font-600 capitalize"}>{configType}</span>
			<span
				className={"capitalize ml-32"}
				css={css`
					font-size: 12.8rem;
				`}
			>
				{array.join(", ").toLowerCase()}
			</span>
		</div>
	);
}

function TestOverviewTab() {
	const { query } = useRouter();
	const { data } = useBuildReport(query.id);
	const [, setSelectedTabIndex] = useAtom(selectedTabAtom);

	const showReview = showReviewButton(data?.status);

	const allConfiguration = getAllConfiguration(data?.tests);
	const countByTestStatus = useMemo(() => {
		return getCountByTestStatus(data?.tests);
	}, [data]);

	return (
		<div className={"flex  mt-48 justify-between"} css={buildContainerWidth}>
			<div css={leftSection}>
				<div css={overviewCard} className={"flex flex-col items-center justify-center pt-120"}>
					<div className={"flex flex-col items-center"}>
						<div className={"mb-28"}>
							<TestStatusSVG type={data?.status} height={"24rem"} width={"28rem"} />
						</div>
						<div className={"font-cera text-15 font-500 mb-24"}>{getStatusString(data?.status)}</div>
						<div className={"flex items-center"}>
							<Conditional showIf={showReview}>
								<Button
									bgColor={"tertiary"}
									css={css`
										width: 148rem;
									`}
									onClick={setSelectedTabIndex.bind(this, 1)}
								>
									<span className={"font-400"}>Review</span>
								</Button>
							</Conditional>
							<Button
								bgColor={"tertiary"}
								css={css`
									width: 148rem;
								`}
								className={"ml-16"}
								onClick={rerunBuild.bind(this, query.id)}
								title="Rerun this build"
							>
								<div className={"flex items-center justify-center text-13 font-400"}>
									<RerunSVG className={"mr-6"} height={"14rem"} />
									Rerun
								</div>
							</Button>
						</div>
						<div className={"mt-60 text-14 font-600 mb-24"}>Your test were run on</div>

						{Object.entries(allConfiguration).map(([key, value]) => (
							<ConfigurationMethod configType={key} array={value} />
						))}
					</div>

					<div
						css={css`
							background: #0a0b0e;
							height: 64rem;
						`}
						className={"flex text-12.5 font-600 w-full mt-100 justify-center"}
					>
						{Object.entries(countByTestStatus).map(([status, count]) => {
							return (
								<div className={"flex items-center px-28"}>
									<TestStatusSVG type={status} height={"18rem"} width={"18rem"} />{" "}
									<span className={"ml-12 leading-none"}>
										{count} {TestTypeLabel[status]}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>
			<div css={rightSection} className={"ml-36 pt-12"}>
				{/* <div className={"mb-32"}>
					<div className={"font-600 text-14 mb-16"}>Reviewers</div>
					<div css={tag} className={"text-13 px-18 py-7 mb-12"}>
						Himanshu
					</div>
					<div css={tag} className={"text-13 px-18  py-7"}>
						Himanshu
					</div>
				</div> */}
				<div>
					<div className={"font-600 text-14 mb-16"}>Environments</div>
					<div css={tag} className={"text-13 px-18  py-7 mb-12"}>
						Production
					</div>
				</div>
			</div>
		</div>
	);
}

const tag = css`
	background: rgba(16, 18, 21, 0.5);
	border: 1rem solid #171c24;
	border-radius: 4px;
	height: 32px;
`;

const overviewCard = css`
	width: 100%;
	min-height: 500px;
	background: rgba(16, 18, 21, 0.5);
	border: 1px solid #171c24;
	box-sizing: border-box;
	border-radius: 4px;
	overflow: hidden;
`;
const leftSection = css`
	width: 70%;
`;
const rightSection = css`
	width: 30%;
	max-width: 315px;
`;

export const TestReportScreen = () => {
	const [selectedTabIndex, setSelectedTabIndex] = useAtom(selectedTabAtom);
	const { query } = useRouter();
	const { data } = useBuildReport(query.id);
	const [, updateMetaData] = useAtom(updateMeta);

	const testsCount = data.tests.length;

	useEffect(() => {
		updateMetaData({
			type: "user",
			key: USER_META_KEYS.VIEW_REPORT,
			value: true,
		});

		updateMetaData({
			type: "project",
			key: PROJECT_META_KEYS.VIEW_REPORT,
			value: true,
		});

		// if (query.view_draft) setSelectedTabIndex(0);
	}, [query.view_draft]);
	return (
		<div className={"pt-46"} css={css`background: #0C0C0C;`}>
			<div css={buildContainerWidth}>
				<ReportInfoTOp />

				<Conditional showIf={selectedTabIndex === 1}>
					<div className={"flex leading-none mt-56 mb-52  items-center invisible"}>
						<div
							className={"text-13"}
							css={css`
								width: 100px;
								line-height: 19rem;
							`}
						>
							Last build
						</div>
						<div css={timeLine} className={"ml-40 relative"}>
							<div className={"absolute flex flex-col items-center"} css={currentSelected}>
								<div className={"mb-8 text-12"}>12Jun</div>
								<div>
									<PassedSVG />
								</div>
							</div>

							<div className={"absolute flex flex-col items-center"} css={timelineItem}>
								<div>
									<PassedSVG />
								</div>
							</div>
						</div>
					</div>
				</Conditional>
				<TabBar />
			</div>
			<Conditional showIf={selectedTabIndex === 0}>
				<ReportSection />
			</Conditional>
		</div>
	);
};

export const buildContainerWidth = css`
max-width: 1300rem;
width: calc(100vw - 296rem) !important;
// width: calc(100vw - 352rem) !important;
	margin: 0 auto;
`;
const timeLine = css`
	height: 2px;
	width: 100%;
	background: #1e242c;
`;

const currentSelected = css`
	position: absolute;
	transform: translateY(-72%);
`;

const timelineItem = css`
	position: absolute;
	transform: translateY(-50%);
	left: 50%;
`;

const statusTag = css`
	min-width: 132rem;
	height: 30rem;
	box-sizing: border-box;
	border-radius: 15.5rem;
`;

const failed = css`
	background: rgba(152, 38, 127, 0.8);
	border: 1px solid rgba(255, 64, 213, 0.46);
`;

const passed = css`
	background: #416a3e;
	border: 1px solid #64ae59;
`;

const review = css`
	background: #44293c;
	border: 1px solid #77516c;
	min-width: 172px;
`;

const running = css`
	background: #1e242c;
	border: 1px solid #545e6b;
`;

const waiting = css`
	border: 1px solid #545e6b;
`;

const Tab = css``;

const TabItem = css`
	position: relative;
	height: 28rem;
	padding: 0 16rem;
	padding-top: 1rem !important;

	margin-right: 4rem;
	border-radius: 6rem;
	:hover {
		background: rgba(255, 255, 255, 0.12);
	}
`;

const selected = css`
	border-radius: 6px;
	color: #fff;
	font-weight: 500;
	background: rgba(255, 255, 255, 0.12);
`;
